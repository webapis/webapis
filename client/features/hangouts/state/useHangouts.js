import { h } from "preact";
import { useHangoutContext } from "./HangoutsProvider";
import { useAuthContext } from "features/authentication";
import { useAppRoute } from "components/app-route";
import { savePendingHangout } from "./actions/delivering-actions/savePendingHangout";
import { changeMessageText } from "./actions";
import saveSentInvitation from "./local-storage/local/saveSentInvitation";
import { savePendingAccept } from "./local-storage/remote/saveRecievedInvitation";
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
  function onHangout(e) {
    //5
    changeMessageText({ text: "", dispatch });
    const command = e.target.id;
    const { email } = hangout;
    const timestamp = Date.now();
    const message =
      messageText !== "" ? { text: messageText, timestamp } : null;
    const pendingHangout = {
      username: hangout.username,
      email,
      message: { text: messageText, timestamp, username },
      command,
      timestamp,
    };
    dispatch({ type: actionTypes.SENDING_HANGOUT_STARTED, pendingHangout });
    savePendingHangout({
      dispatch,
      name: username,
      hangout: {
        username: hangout.username,
        email,
        state: command,
        message: { text: messageText, timestamp, delivered: false, username },
        timestamp,
        delivered: false,
      },
    });
  } //end onHangout

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
    saveSentInvitation({ hangout: invitation, name: username, dispatch });
    dispatch({
      type: actionTypes.SENDING_HANGOUT_STARTED,
      pendingHangout: invitation,
    });
  }
  function onAccept() {
    const { email } = hangout;
    const timestamp = Date.now();
    const accept = {
      username: hangout.username,
      email,
      message: null,
      command: "ACCEPT",
      timestamp,
    };
    savePendingAccept({ name: username, dispatch, hangout: accept });
    dispatch({
      type: actionTypes.SENDING_HANGOUT_STARTED,
      pendingHangout: accept,
    });
  }
  function onDecline() {}
  function onBlock() {}
  function onUnblock() {}
  function onMessage() {}
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
