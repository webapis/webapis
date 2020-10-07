import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useEffect,
  useState,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import { useHangoutContext } from "./HangoutsProvider";
import { useAppRoute } from "../../../components/app-route/index";
import { changeMessageText } from "./actions";
import { emailRegex } from "../../authentication/validation/validationRegex";
import { loadHangouts, loadMessages } from "./local-storage/common";
import { actionTypes } from "./actionTypes";

export function useHangoutNav({ user, appRoute }) {
  const { onAppRoute } = useAppRoute();
  const [rootRoute, setRoute] = useState(null);
  useEffect(() => {
    if (appRoute) {
      setRoute(appRoute);
    }
  }, [appRoute]);
  function onNavigation(e) {
    e.preventDefault();
    if (user) {
      const id = e.currentTarget.id;

      onAppRoute({ featureRoute: `/${id}`, appRoute: "/" });
    } else {
      onAppRoute({ featureRoute: `/login`, appRoute: "/auth" });
    }
  }
  return { onNavigation };
}

export function useHangouts({ user, appRoute }) {
  const { onAppRoute } = useAppRoute();
  const { onNavigation } = useHangoutNav({ user, appRoute });
  const username = user && user.username;
  const [state, dispatch] = useHangoutContext();
  const { hangouts, inviteGuest, guestEmail, on_user_client_command } = state;

  function onMessageText(e) {
    const text = e.target.value;
    changeMessageText({ dispatch, text });
  }

  function onUserClientCommand(e) {
    const id = e.target.id;

    switch (id) {
      case "INVITE":
      case "BLOCK":
      case "DECLINE":
      case "UNBLOCK":
        onAppRoute({ appRoute, featureRoute: `/HANGCHAT` });
        break;
      case "UNDECLINE":
        changeMessageText({ text: "Invitation accepted", dispatch });
        onAppRoute({ appRoute, featureRoute: `/HANGCHAT` });
        break;
      case "ACCEPT":
        changeMessageText({ text: "Invitation accepted", dispatch });
        break;
      default:
    }
    dispatch({
      type: actionTypes.ON_USER_CLIENT_COMMAND,
      on_user_client_command: id,
    });
  }
  function onSearchInput(e) {
    let localHangouts = JSON.parse(
      localStorage.getItem(`${username}-hangouts`)
    );
    if (localHangouts && localHangouts.length > 0) {
      let filteredHangouts = localHangouts.filter((h) =>
        h.target.includes(e.target.value)
      );
      dispatch({
        type: actionTypes.HANGOUTS_UPDATED,
        hangouts: filteredHangouts,
      });
    }

    dispatch({ type: actionTypes.SEARCH_INPUT_CHANGE, search: e.target.value });
  }

  function onSearch() {
    dispatch({ type: actionTypes.SEARCH_HANGOUT_STARTED });
  }
  function onSearchSelect(e) {
    e.preventDefault();

    const { id } = e.currentTarget;

    const selectedHangout = hangouts.find((s) => s.target === id);

    if (selectedHangout) {
      dispatch({
        type: actionTypes.SELECTED_HANGOUT,
        hangout: selectedHangout,
      });
      onAppRoute({
        featureRoute: `/${selectedHangout.state}`,
        appRoute,
      });

      loadMessages({ hangout: selectedHangout, username, dispatch });
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

  // function loadLocalHangouts() {
  //   loadHangouts({ username, dispatch });
  // }
  function resetGuestInvitation() {
    dispatch({ type: actionTypes.RESET_GUEST_INVITATION });
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
      // loadLocalHangouts,
      resetGuestInvitation,
    },
  };
}
