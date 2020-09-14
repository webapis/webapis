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
import { useMessage } from "./useMessage";
import { useAuth } from "features/authentication/state/useAuth";
import { actionTypes } from "./actionTypes";
import * as actions from "./actions";
import { clientCommands } from "./clientCommands";
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
import { useAppRoute } from "components/app-route/index";
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
  const { sendMessage, message, connectionState } = props;

  const { onAppRoute } = useAppRoute();
  const { state: authState } = useAuth();
  const { user, browserId } = authState;
  const [state, dispatch] = useReducer(reducer, initState);
  const {
    hangout,
    on_user_client_command,
    messageText,
    searchHangouts,
    search,
    sendhangout,
  } = state;

  const handleMessage = useMessage({
    message,
    username: user && user.username,
    dispatch,
    focusedHangout: hangout,
    sendhangout,
  });
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
  // function sendPendingHangout({ hangout }) {
  //   dispatch({
  //     type: actionTypes.SENDING_HANGOUT_STARTED,
  //     pendingHangout: hangout,
  //   });
  //   dispatch({
  //     type: actionTypes.ON_USER_CLIENT_COMMAND,
  //     on_user_client_command: null,
  //   });
  // }
  function onInvite() {
    const { email } = hangout;

    const timestamp = Date.now();

    const message =
      messageText !== "" ? { text: messageText, timestamp } : null;

    const invitation = {
      username: hangout.username,
      email,
      message,
      command: "INVITE",
      timestamp,
      browserId,
    };

    saveHangout({
      hangout: { ...invitation, state: "INVITE", command: undefined },
      name: user && user.username,
      dispatch,
    });

    saveSentMessage({
      hangout: invitation,
      dispatch,
      name: user && user.username,
      dState: "pending",
    });

    onAppRoute({ featureRoute: `/INVITE`, route: "/hangouts" });

    sendMessage({ data: invitation, type: "HANGOUT" });
    // sendPendingHangout({ hangout: invitation });
  }

  function onAccept() {
    const { email, timestamp } = hangout;

    const accept = {
      username: hangout.username,
      email,
      message: { text: "Accepted your invitation", timestamp },
      command: "ACCEPT",
      timestamp,
      browserId,
    };

    saveHangout({
      hangout: { ...accept, state: "ACCEPT", command: undefined },
      name: user && user.username,
      dispatch,
    });
    saveSentMessage({
      hangout: accept,
      dispatch,
      name: user && user.username,
      dState: "pending",
    });

    saveRecievedMessage({
      hangout,
      dispatch,
      name: user && user.username,
      dState: "read",
    });
    removeUnread({ dispatch, hangout: accept, name: user && user.username });
    onAppRoute({ featureRoute: `/ACCEPT`, route: "/hangouts" });
    //sendPendingHangout({ hangout: accept });
    sendMessage({ data: accept, type: "HANGOUT" });
  }
  function onDecline() {
    const { email, timestamp } = hangout;

    const decline = {
      username: hangout.username,
      email,
      message: null,
      command: "DECLINE",
      timestamp,
      browserId,
    };
    removeUnread({ hangout, dispatch, name: user && user.username });
    onAppRoute({ featureRoute: `/DECLINE`, route: "/hangouts" });
    //sendPendingHangout({ hangout: decline });
    sendMessage({ data: decline, type: "HANGOUT" });
  }

  function onMessage() {
    const timestamp = Date.now();

    const message = { text: messageText, timestamp };

    const messaging = {
      username: hangout.username,
      email: hangout.email,
      message,
      command: "MESSAGE",
      timestamp,
      browserId,
    };
    saveSentMessage({
      hangout: messaging,
      dispatch,
      name: user && user.username,
      dState: "pending",
    });
    if (hangout.state === "BLOCKER") {
      saveSentMessage({
        ///------------------------------updating tobe checked
        hangout: {
          ...hangout,
          message: {
            ...hangout.message,
            text: "You cannot send this message because you are blocked",
            type: "blocker",
          },
        },
        dispatch,
        name: user && user.username,
        dState: "pending",
      });
    } else {
      // sendPendingHangout({ hangout: messaging });
      sendMessage({ data: messaging, type: "HANGOUT" });
    }
    dispatch({ type: actionTypes.MESSAGE_TEXT_CHANGED, text: "" });
  }
  function onBlock() {
    const { email } = hangout;

    const timestamp = Date.now();
    const block = {
      username: hangout.username,
      email,
      message: {
        text: "You have blocked this message",
        timestamp,
        type: "blocked",
      },
      command: "BLOCK",
      timestamp,
      browserId,
    };

    saveSentMessage({
      hangout: {
        ...block,
      },
      dispatch,
      name: user && user.username,
      dState: "pending",
    });
    //sendPendingHangout({ hangout: block });
    sendMessage({ data: block, type: "HANGOUT" });
  }
  function onUnblock() {}
  useEffect(() => {
    if (on_user_client_command && user && hangout && sendhangout) {
      switch (on_user_client_command) {
        case clientCommands.MESSAGE:
          onMessage();
          break;
        case clientCommands.INVITE:
          onInvite();
          break;
        case clientCommands.ACCEPT:
          onAccept();
          break;
        case clientCommands.DECLINE:
          onDecline();
          break;
        case clientCommands.BLOCK:
          onBlock();
          break;
        case clientCommands.UNBLOCK:
          onUnblock();
          break;
        default:
          throw "No matching clientCommand found";
      }
    }
  }, [on_user_client_command, user, hangout]);
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
          onRead();
          removeUnreads({
            dispatch,
            name: user && user.username,
            hangout,
            state: "MESSANGER",
          });
          break;
        case "INVITEE":
          dispatch({
            type: actionTypes.MESSAGE_TEXT_CHANGED,
            text: `Let's chat, ${hangout.username}!`,
          });
          break;
        default:
          break;
      }

      // load messages from local storage
      loadMessages({ hangout, name: user && user.username, dispatch });
      setTimeout(() => {}, 100);
    }
  }, [hangout, user]);

  // useEffect(() => {
  //   if (!username) {
  //     dispatch({ type: actionTypes.SET_HANGOUT_TO_INIT_STATE });
  //   }
  // }, [username]);
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
