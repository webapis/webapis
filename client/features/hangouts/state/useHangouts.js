import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";

import { useHangoutContext } from "./HangoutsProvider";
import { useAuthContext } from "features/authentication/index";
import { useAppRoute } from "components/app-route/index";

import { changeMessageText } from "./actions";
import { emailRegex } from "../../authentication/validation/validationRegex";

import { actionTypes } from "./actionTypes";

export function useHangouts() {
  const { onAppRoute } = useAppRoute();
  const authContext = useAuthContext();
  const username = authContext.state.user && authContext.state.user.username;
  const [state, dispatch] = useHangoutContext();
  const { hangouts, inviteGuest, guestEmail } = state;

  function onNavigation(e) {
    e.preventDefault();
    if (authContext.state.user) {
      const id = e.currentTarget.id;
      onAppRoute({ featureRoute: `/${id}`, route: "/hangouts" });
    } else {
      onAppRoute({ featureRoute: `/login`, route: "/auth" });
    }
  }

  function onMessageText(e) {
    const text = e.target.value;
    changeMessageText({ dispatch, text });
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
  function onSearchSelect(e) {
    e.preventDefault();

    const { id } = e.currentTarget;

    const selectedHangout = hangouts.find((s) => s.username === id);

    if (selectedHangout) {
      dispatch({
        type: actionTypes.SELECTED_HANGOUT,
        hangout: selectedHangout,
      });
      onAppRoute({
        featureRoute: `/${selectedHangout.state}`,
        route: "/hangouts",
      });
    }
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
    const emailConstraint = new RegExp(emailRegex);
    if (guestEmail === "") {
      dispatch({
        type: actionTypes.VALIDATED_GUEST_EMAIL_FORMAT,
        isValidGuestEmail: false,
      });
    } else if (guestEmail !== "" && !emailConstraint.test(guestEmail)) {
      dispatch({
        type: actionTypes.VALIDATED_GUEST_EMAIL_FORMAT,
        isValidGuestEmail: false,
      });
    } else {
      dispatch({
        type: actionTypes.INVITE_AS_GUEST_STARTED,
        isValidGuestEmail: true,
      });
    }
  }
  function onGuestEmailInputFocus() {
    dispatch({
      type: actionTypes.VALIDATED_GUEST_EMAIL_FORMAT,
      isValidGuestEmail: undefined,
    });
  }

  function onScrollToBottom(scrollToBottom) {
    dispatch({ type: actionTypes.SCROLL_TO_BOTTOM, scrollToBottom });
  }
  return {
    state: { ...state, name: username, dispatch },
    funcs: {
      onScrollToBottom,
      onGuestEmailChange,
      onSearchSelect,
      onMessageForGuestInput,
      onInviteGuest,
      onSearchInput,
      onSearch,
      onSendInviteGuest,
      onUserClientCommand,
      onGuestEmailInputFocus,
      onNavigation,
      onMessageText,
    },
  };
}
