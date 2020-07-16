import { h } from "preact";
import { useHangoutContext } from "./HangoutsProvider";
import { useAuthContext } from "features/authentication";
import { useAppRoute } from "components/app-route";
import { changeMessageText } from "./actions";

import {
  updateUnread,
  saveSentMessage,
  saveHangout,
  updateHangout,
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
  }
  function onAccept() {
    try {
      const { email, timestamp } = hangout;
      debugger;
      const accept = {
        username: hangout.username,
        email,
        message: { text: "Accepted your invitation", timestamp },
        command: "ACCEPT",
        timestamp,
      };
      debugger;
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
      console.error(error);
    }
  }
  function onDecline() {
    try {
      const { email, timestamp } = hangout;

      const decline = {
        username: hangout.username,
        email: hangout.email,
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
      console.error(error);
    }
  }

  function onMessage() {
    const { email } = hangout;
    const timestamp = Date.now();
    debugger;
    const message =
      messageText !== "" ? { text: messageText, timestamp } : null;
    const messaging = {
      username: hangout.username,
      email,
      message,
      command: "MESSAGE",
      timestamp,
    };
    updateHangout({ hangout: messaging, name: username, dispatch });
    saveSentMessage({ hangout, dispatch, name: username, dState: "pending" });
    dispatch({
      type: actionTypes.SENDING_HANGOUT_STARTED,
      pendingHangout: messaging,
    });
  }
  function onBlock() {}
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
