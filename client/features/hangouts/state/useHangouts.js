import { h } from "preact";
import { useHangoutContext } from "./HangoutsProvider";
import { useAuthContext } from "features/authentication";
import { useAppRoute } from "components/app-route";
import { useApplication } from "components/app-provider";
import { changeMessageText } from "./actions";

import {
  updateUnread,
  saveSentMessage,
  saveHangout,
  updateHangout,
} from "./local-storage/common";
import { actionTypes } from "./actionTypes";

export function useHangouts() {
  const { displayError } = useApplication();
  const { onAppRoute } = useAppRoute();
  const authContext = useAuthContext();
  const username = authContext.state.user && authContext.state.user.username;
  const [state, dispatch] = useHangoutContext();
  const { hangout, hangouts, messageText, messages, readyState } = state;
  function onNavigation(e) {
    try {
      e.stopPropagation();
      const id = e.currentTarget.id;
      onAppRoute({ featureRoute: `/${id}`, route: "/hangouts" });
    } catch (error) {
      displayError({ error });
    }
  }

  function onMessageText(e) {
    try {
      const text = e.target.value;
      changeMessageText({ dispatch, text });
    } catch (error) {
      displayError({ error });
    }
  }

  function onInvite() {
    try {
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
      saveHangout({ hangout: invitation, name: username, dispatch });
      saveSentMessage({
        hangout: invitation,
        dispatch,
        name: username,
        dState: "pending",
      });

      dispatch({
        type: actionTypes.SENDING_HANGOUT_STARTED,
        pendingHangout: invitation,
      });
      changeMessageText({ dispatch, text: "" });
    } catch (error) {
      displayError({ error });
    }
  }
  function onAccept() {
    try {
      const { email, timestamp } = hangout;

      const accept = {
        username: hangout.username,
        email,
        message: { text: "Accepted your invitation", timestamp },
        command: "ACCEPT",
        timestamp,
      };

      saveHangout({ hangout: accept, name: username, dispatch });
      saveSentMessage({
        hangout: accept,
        dispatch,
        name: username,
        dState: "pending",
      });
      updateUnread({ dispatch, hangout: accept, name: username });
      dispatch({
        type: actionTypes.SENDING_HANGOUT_STARTED,
        pendingHangout: accept,
      });
    } catch (error) {
      displayError({ error });
    }
  }
  function onDecline() {
    try {
      const { email, timestamp } = hangout;

      const decline = {
        username: hangout.username,
        email,
        message: { text: "Your invitation declined", timestamp },
        command: "DECLINE",
        timestamp,
      };

      updateUnread({ dispatch, hangout: decline, name: username });
      saveSentMessage({
        hangout: decline,
        name: username,
        dispatch,
        dState: "pending",
      });
      dispatch({
        type: actionTypes.SENDING_HANGOUT_STARTED,
        pendingHangout: decline,
      });
    } catch (error) {
      displayError({ error });
    }
  }

  function onMessage() {
    try {
      const { email, state } = hangout;
      const timestamp = Date.now();

      const message =
        messageText !== "" ? { text: messageText, timestamp } : null;
      const messaging = {
        username: hangout.username,
        email,
        message,
        command: "MESSAGE",
        timestamp,
      };
      saveSentMessage({
        hangout: messaging,
        dispatch,
        name: username,
        dState: "pending",
      });
      if (hangout.state === "BLOCKER") {
        debugger;
        saveSentMessage({
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
          dState: "pending",
        });
      } else {
        updateHangout({ hangout: messaging, name: username, dispatch });

        dispatch({
          type: actionTypes.SENDING_HANGOUT_STARTED,
          pendingHangout: messaging,
        });
      }
      changeMessageText({ dispatch, text: "" });
    } catch (error) {
      displayError({ error });
    }
  }
  function onBlock() {
    try {
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
    } catch (error) {
      displayError({ error });
    }
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
