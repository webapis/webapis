import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import { useHangoutContext } from "./HangoutsProvider";
import { useAuthContext } from "features/authentication/index";
import { useAppRoute } from "components/app-route/index";

import { changeMessageText } from "./actions";

import {
  updateUnread,
  saveSentMessage,
  saveHangout,
  updateHangout,
  removeUnread,
} from "./local-storage/common";
import { actionTypes } from "./actionTypes";

export function useHangouts() {
  const { onAppRoute } = useAppRoute();
  const authContext = useAuthContext();
  const username = authContext.state.user && authContext.state.user.username;
  const [state, dispatch] = useHangoutContext();
  const { hangout, hangouts, messageText, messages, readyState } = state;
  function onNavigation(e) {
    e.stopPropagation();
    const id = e.currentTarget.id;
    onAppRoute({ featureRoute: `/${id}`, route: "/hangouts" });
  }

  function onMessageText(e) {
    const text = e.target.value;
    changeMessageText({ dispatch, text });
  }

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
    };
    saveHangout({
      hangout: { ...invitation, state: "INVITE", command: undefined },
      name: username,
      dispatch,
    });
    saveSentMessage({
      hangout: invitation,
      dispatch,
      name: username,
    });

    dispatch({
      type: actionTypes.SENDING_HANGOUT_STARTED,
      pendingHangout: invitation,
    });
  }
  function onAccept() {
    const { email, timestamp } = hangout;

    const accept = {
      username: hangout.username,
      email,
      message: { text: "Accepted your invitation", timestamp },
      command: "ACCEPT",
      timestamp,
    };

    saveHangout({
      hangout: { ...accept, state: "ACCEPT", command: undefined },
      name: username,
      dispatch,
    });
    saveSentMessage({
      hangout: accept,
      dispatch,
      name: username,
      dState: "pending",
    });
    removeUnread({ dispatch, hangout: accept, name: username });
    dispatch({
      type: actionTypes.SENDING_HANGOUT_STARTED,
      pendingHangout: accept,
    });
  }
  function onDecline() {
    const { email, timestamp } = hangout;

    const decline = {
      username: hangout.username,
      email,
      message: null,
      command: "DECLINE",
      timestamp,
    };
    dispatch({
      type: actionTypes.SENDING_HANGOUT_STARTED,
      pendingHangout: decline,
    });
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
    };
    saveSentMessage({
      hangout: messaging,
      dispatch,
      name: username,
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
        name: username,
      });
    } else {
      updateHangout({
        hangout: { ...messaging, state: "MESSAGE" },
        name: username,
        dispatch,
      });

      dispatch({
        type: actionTypes.SENDING_HANGOUT_STARTED,
        pendingHangout: messaging,
      });
    }
    changeMessageText({ dispatch, text: "" });
  }
  function onBlock() {
    const { email } = hangout;
    const timestamp = Date.now();
    const block = {
      username: hangout.username,
      email,
      message: {
        text: "You have blocked this user",
        timestamp,
        type: "blocked",
      },
      command: "BLOCK",
      timestamp,
    };

    updateHangout({ hangout: block, name: username, dispatch });
    saveSentMessage({
      hangout: block,
      dispatch,
      name: username,
      dState: "pending",
    });
    dispatch({
      type: actionTypes.SENDING_HANGOUT_STARTED,
      pendingHangout: block,
    });
  }
  function onUnblock() {}

  return {
    onInvite,
    onAccept,
    onDecline,
    onBlock,
    onUnblock,
    onMessage,
    state,
    onNavigation,
    onMessageText,
    messageText,
    dispatch,
    hangout,
    hangouts,
    username,
    messages,
    readyState,
  };
}
