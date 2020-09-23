import {
  h,
  createContext,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useContext,
  useMemo,
  useReducer,
  useEffect,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { reducer, initState } from "./reducer";
import { useMessage } from "./message-hooks/useMessage";
import { actionTypes } from "./actionTypes";
import * as actions from "./actions";
import { clientCommands } from "./clientCommands";
import { loadBrowserId } from "../../authentication/state/AuthProvider";
import {
  loadMessages,
  removeUnreads,
  updateRecievedMessages,
  updateRecievedMessage,
  saveHangout,
  saveSentMessage,
  saveRecievedMessage,
  removeUnread,
} from "./local-storage/common";
import { useAuth } from "../../authentication/state/useAuth";
//import { useAppRoute } from "./message-hooks/node_modules/components/app-route/index";
import useClientCommands from "./useClientCommands";
const html = htm.bind(h);
const HangoutContext = createContext();
export function useHangoutContext() {
  const context = useContext(HangoutContext);
  if (!context) {
    throw new Error("useHangoutContext must be used with HangoutsProvider");
  }

  return context;
}

export default function HangoutsProvider(props) {
  const {
    state: { user },
  } = useAuth();
  const { sendMessage, message, connectionState } = props;

  //const { onAppRoute } = useAppRoute();

  const [state, dispatch] = useReducer(reducer, initState);
  const {
    hangout,
    // on_user_client_command,
    //  messageText,
    searchHangouts,
    search,
    messages,
    invitingGuest,
    guestEmail,
    messageForGuest,
    //  sendhangout,
  } = state;

  useMessage({
    message,
    username: user && user.username,
    dispatch,
    focusedHangout: hangout,
    browserId: loadBrowserId(),
  });
  useClientCommands({
    state,
    dispatch,
    sendMessage,
    user,
    browserId: loadBrowserId(),
  });

  useEffect(() => {
    if (invitingGuest && user && guestEmail && messageForGuest) {
      actions.InviteAsGuest({
        from: user.email,
        to: guestEmail,
        subject: messageForGuest,
        text: "invitation",
        type: "GUEST_INVITATION",
        dispatch,
      });
    }
  }, [invitingGuest, user, guestEmail, messageForGuest]);
  useEffect(() => {
    if (connectionState === "open") {
      dispatch({
        type: actionTypes.SOCKET_CONNECTION_STATE_CHANGED,
        connected: true,
      });
    } else if (connectionState === "close") {
      dispatch({
        type: actionTypes.SOCKET_CONNECTION_STATE_CHANGED,
        connected: false,
      });
    }
  }, [connectionState]);
  useEffect(() => {
    if (searchHangouts) {
      actions.searchHangouts({
        search,
        dispatch,
        username: user && user.username,
      });
    }
  }, [searchHangouts]);

  useEffect(() => {
    if (user === null) {
      dispatch({ type: actionTypes.SET_HANGOUT_TO_INIT_STATE });
    }
  }, [user]);
  function onRead() {
    updateRecievedMessages({
      hangout,
      name: user && user.username,
      dispatch,
      dState: "read",
    });
    dispatch({
      type: actionTypes.SENDING_HANGOUT_STARTED,
      pendingHangout: { ...hangout, command: clientCommands.READING },
    });
  }

  useEffect(() => {
    if (hangout && user) {
      switch (hangout.state) {
        // case "ACCEPTER":
        // case "INVITER":
        // case "DECLINER":
        // case "BLOCKER":
        case "MESSANGER":
          //case "UNBLOCKER":
          // case "READER":
          // onRead();
          // removeUnreads({
          //   dispatch,
          //   name: user && user.username,
          //   hangout,
          //   state: "MESSANGER",
          // });
          break;
        case "INVITEE":
          dispatch({
            type: actionTypes.MESSAGE_TEXT_CHANGED,
            text: `Let's chat, ${hangout.target}!`,
          });
          break;
        default:
          break;
      }

      // load messages from local storage
      // loadMessages({ hangout, name: user && user.username, dispatch });
      setTimeout(() => {}, 100);
    }
  }, [hangout, user]);

  useEffect(() => {
    if (user) {
      const unreadhangoutKey = `${user && user.username}-unread-hangouts`;
      const unreadhangouts = JSON.parse(localStorage.getItem(unreadhangoutKey));
      if (unreadhangouts && unreadhangouts.length > 0) {
        dispatch({ type: actionTypes.UNREAD_HANGOUTS_UPDATED, unreadhangouts });
      }
    }

    const hangoutKey = `${user && user.username}-hangouts`;
    const hangouts = JSON.parse(localStorage.getItem(hangoutKey));

    if (
      !hangouts &&
      user &&
      user.username &&
      user &&
      user.username.length > 0
    ) {
      dispatch({ type: actionTypes.FETCH_HANGOUTS_STARTED });
    }
  }, [user]);

  const value = useMemo(() => [state, dispatch], [state]);
  return html`<${HangoutContext.Provider} value=${value} ...${props} />`;
}
