import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useEffect,
  useState,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import { useHangoutContext } from "./HangoutsProvider";
import { useAuthContext } from "features/authentication/index";
import { useAppRoute } from "components/app-route/index";

import { changeMessageText } from "./actions";
import { clientCommands } from "./clientCommands";
import {
  saveSentMessage,
  saveHangout,
  updateRecievedMessage,
  removeUnread,
  saveRecievedMessage,
} from "./local-storage/common";
import { actionTypes } from "./actionTypes";

export function useHangouts() {
  const { onAppRoute } = useAppRoute();
  const authContext = useAuthContext();
  const username = authContext.state.user && authContext.state.user.username;
  const { user } = authContext.state;
  const [state, dispatch] = useHangoutContext();
  const {
    hangout,
    hangouts,
    messageText,
    messages,
    inviteGuest,
    pendingHangout,
    loading,
  } = state;

  function onNavigation(e) {
    e.stopPropagation();
    const id = e.currentTarget.id;
    onAppRoute({ featureRoute: `/${id}`, route: "/hangouts" });
  }

  //   function sendPendingHangout({ hangout }) {
  //     dispatch({
  //       type: actionTypes.SENDING_HANGOUT_STARTED,
  //       pendingHangout: hangout,
  //     });
  //  }

  function onMessageText(e) {
    const text = e.target.value;
    changeMessageText({ dispatch, text });
  }

  function emptyHangout() {
    dispatch({ type: actionTypes.HANGOUT_UPDATED, hangout: null });
  }
  function onUserClientCommand(e) {
    const id = e.target.id;

    dispatch({
      type: actionTypes.ON_USER_CLIENT_COMMAND,
      on_user_client_command: id,
    });
  }
  function onSearchInput(e) {
    dispatch({ type: actionTypes.SEARCH_INPUT_CHANGE, search: e.target.value });
  }

  function onSearch() {
    dispatch({ type: actionTypes.SEARCH_HANGOUT_STARTED });
  }
  function onInviteGuest() {
    dispatch({ type: actionTypes.INVITE_GUEST, inviteGuest: !inviteGuest });
  }
  function onMessageForGuestInput(e) {
    const value = e.target.value;
    dispatch({
      type: actionTypes.MESSAGE_TEXT_CHANGED,
      messageForGuest: value,
    });
  }
  function onGuestEmailChange(e) {
    dispatch({
      type: actionTypes.GUEST_EMAIL_CHANGED,
      guestEmail: e.target.value,
    });
  }
  function onSendInviteGuest(e) {
    dispatch({ type: actionTypes.INVITE_AS_GUEST_STARTED });
  }
  return {
    onGuestEmailChange,
    onMessageForGuestInput,
    onInviteGuest,
    onSearchInput,
    onSearch,
    onSendInviteGuest,
    onUserClientCommand,
    // onInvite,
    // onAccept,
    // onDecline,
    // onBlock,
    // onUnblock,
    // onMessage,
    state,
    onNavigation,
    onMessageText,
    messageText,
    dispatch,
    hangout,
    hangouts,
    username,
    messages,
    //readyState,
    emptyHangout,
  };
}
