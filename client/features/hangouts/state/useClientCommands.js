import {
  useContext,
  useMemo,
  useReducer,
  useEffect,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
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
import { useAppRoute } from "../../../components/app-route/index";
import { actionTypes } from "./actionTypes";
export default function useClientCommands({
  state,
  sendMessage,
  user,
  browserId,
  dispatch,
}) {
  const { onAppRoute } = useAppRoute();
  const { hangout, sendhangout, on_user_client_command, messageText } = state;
  function onInvite() {
    const { email } = hangout;

    const timestamp = Date.now();

    const message =
      messageText !== ""
        ? { text: messageText, timestamp, type: "invited" }
        : null;

    const invitation = {
      target: hangout.target,
      email,
      message,
      command: "INVITE",
      timestamp,
      browserId,
    };

    saveHangout({
      hangout: { ...invitation, state: "INVITE", command: undefined },
      username: user && user.username,
      dispatch,
    });

    saveSentMessage({
      hangout: invitation,
      dispatch,
      username: user && user.username,
      dState: "pending",
    });

    onAppRoute({ featureRoute: `/INVITED`, appRoute: "/hangouts" });

    sendMessage({ data: invitation, type: "HANGOUT" });
  }

  function onAccept() {
    const { email, timestamp } = hangout;

    const accept = {
      target: hangout.target,
      email,
      message: { text: "Accepted your invitation", timestamp },
      command: "ACCEPT",
      timestamp,
      browserId,
    };

    saveSentMessage({
      hangout: accept,
      dispatch,
      username: user && user.username,
      dState: "pending",
    });

    onAppRoute({ featureRoute: `/ACCEPT`, appRoute: "/hangouts" });

    sendMessage({ data: accept, type: "HANGOUT" });
  }
  function onDecline() {
    const { email, timestamp } = hangout;

    const decline = {
      target: hangout.target,
      email,
      message: null,
      command: "DECLINE",
      timestamp,
      browserId,
    };
    removeUnread({ hangout, dispatch, username: user && user.username });
    onAppRoute({ featureRoute: `/DECLINE`, appRoute: "/hangouts" });
    //sendPendingHangout({ hangout: decline });
    sendMessage({ data: decline, type: "HANGOUT" });
  }

  function onMessage() {
    const timestamp = Date.now();

    const message = { text: messageText, timestamp };

    const messaging = {
      target: hangout.target,
      email: hangout.email,
      message,
      command: "MESSAGE",
      timestamp,
      browserId,
    };

    if (hangout.state === "BLOCKER") {
      saveSentMessage({
        ///------------------------------updating tobe checked
        hangout: {
          ...hangout,
          message: {
            ...message,
            type: "blocker",
          },
        },
        dispatch,
        username: user && user.username,
        dState: "blocked",
      });
    } else {
      saveSentMessage({
        hangout: messaging,
        dispatch,
        username: user && user.username,
        dState: "pending",
      });
      sendMessage({ data: messaging, type: "HANGOUT" });
    }
    dispatch({ type: actionTypes.MESSAGE_TEXT_CHANGED, text: "" });
  }
  function onBlock() {
    const { email } = hangout;

    const timestamp = Date.now();
    const block = {
      target: hangout.target,
      email,
      message: {
        text: "",
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
      username: user && user.username,
      dState: "pending",
    });
    //sendPendingHangout({ hangout: block });
    onAppRoute({ featureRoute: "/HANGCHAT", appRoute: "/hangouts" });
    sendMessage({ data: block, type: "HANGOUT" });
  }
  function onUnblock() {}

  useEffect(() => {
    if (on_user_client_command && user && hangout && sendhangout) {
      switch (on_user_client_command) {
        case clientCommands.MESSAGE:
          onMessage();
          clientCommandFulfilled();
          break;
        case clientCommands.INVITE:
          onInvite();
          clientCommandFulfilled();
          break;
        case clientCommands.ACCEPT:
          onAccept();
          clientCommandFulfilled();
          break;
        case clientCommands.DECLINE:
          onDecline();
          clientCommandFulfilled();
          break;
        case clientCommands.BLOCK:
          onBlock();
          clientCommandFulfilled();
          break;
        case clientCommands.UNBLOCK:
          onUnblock();
          clientCommandFulfilled();
          break;
        default:
          throw "No matching clientCommand found";
      }
    }
  }, [on_user_client_command, user, hangout]);
  function clientCommandFulfilled() {
    dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
  }
  return {};
}
