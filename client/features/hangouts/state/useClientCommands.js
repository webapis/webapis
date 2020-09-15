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
export default function useClientCommands({
  state,
  onAppRoute,
  sendMessage,
  user,
  browserId,
  dispatch,
}) {
  const { hangout, sendhangout, on_user_client_command, messageText } = state;
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

  return {};
}
