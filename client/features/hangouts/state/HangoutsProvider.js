import { h, createContext } from "preact";
import { useContext, useMemo, useReducer, useEffect } from "preact/hooks";
import htm from "htm.module";
import { reducer, initState } from "./reducer";
import { useMessage } from "./message-hooks/useMessage";
import { actionTypes } from "./actionTypes";
import * as actions from "./actions";
import { clientCommands } from "./clientCommands";
import { loadBrowserId } from "../../authentication/state/AuthProvider";
import { loadHangouts } from "./local-storage/common";
import {
  loadMessages,
  removeUnreads,
  updateRecievedMessages,
  updateRecievedMessage,
  saveHangout,
  saveSentMessage,
  saveRecievedMessage,
  removeUnread,
  loadOfflineSentHangouts,
} from "./local-storage/common";

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
  const { sendMessage, message, connectionState, user } = props;

  const [state, dispatch] = useReducer(reducer, initState);
  const {
    hangout,
    searchHangouts,
    search,
    messages,
    invitingGuest,
    guestEmail,
    messageForGuest,
    socketConnected,
    hangouts,
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
    if (user && socketConnected) {
      actions.fetchHangouts({ dispatch, username: user.username });
    }
    if (user && !socketConnected) {
      loadHangouts({ username: user.username, dispatch });
    }
  }, [user, socketConnected]);

  useEffect(() => {
    if (
      socketConnected &&
      user &&
      loadOfflineSentHangouts({ username: user.username })
    ) {
      sendMessage({
        data: {
          hangouts: loadOfflineSentHangouts({ username: user.username }),
          sender: user && user.username,
          type: "OFFLINE_HANGOUTS",
        },
        type: "HANGOUT",
      });
    }
  }, [socketConnected, user]);
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
    if (searchHangouts && user) {
      actions.searchHangouts({
        search,
        dispatch,
        username: user && user.username,
      });
    }
  }, [searchHangouts, user]);

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
        case "MESSANGER":
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
