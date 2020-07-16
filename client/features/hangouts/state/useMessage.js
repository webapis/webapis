import { h } from "preact";
import { useEffect } from "preact/hooks";
import { useAppRoute } from "components/app-route";
import { hangoutStates } from "server/hangouts/hangoutStates";
import { actionTypes } from "./actionTypes";
import {
  updateUnread,
  updateSentMessage,
  saveUnread,
  saveRecievedMessage,
  updateHangout,
} from "./local-storage/common";
export function useMessage({ message, username, dispatch, focusedHangout }) {
  const { onAppRoute } = useAppRoute();
  function handleAcknowledgement({ hangout, offline }) {
    switch (hangout.state) {
      case hangoutStates.UNBLOCKED:
        saveUnblovked({
          dispatch,
          hangout,
          name: username,
          focusedHangout,
          onAppRoute,
          offline,
        });
        break;
      case hangoutStates.INVITED:
        debugger;
        updateHangout({ dispatch, hangout, name: username });
        updateSentMessage({ hangout, name: username, dispatch });
        dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
        onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
        break;
      case hangoutStates.DECLINED:
        debugger;
        updateUnread({ dispatch, hangout, name: username });
        updateSentMessage({ hangout, name: username, dispatch });
        dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
        onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
        break;
      case hangoutStates.ACCEPTED:
        debugger;
        updateUnread({ dispatch, hangout, name: username });
        updateHangout({ dispatch, hangout, name: username });
        updateSentMessage({ hangout, name: username, dispatch });
        dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
        onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
        break;
      case hangoutStates.BLOCKED:
        // saveBlocked({
        //   dispatch,
        //   hangout,
        //   name: username,
        //   focusedHangout,
        //   onAppRoute,
        //   offline,
        // });
        break;

      case hangoutStates.MESSAGED:
        updateHangout({ dispatch, name: username, hangout });
        updateSentMessage({
          hangout,
          name: username,
          dispatch,
          dState: "delivered",
        });
        dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
        break;
      default:
        break;
    }
  }

  function onHangout({ hangout }) {
    switch (hangout.state) {
      case hangoutStates.ACCEPTER:
        debugger;
        updateHangout({ dispatch, name: username, hangout });
        saveRecievedMessage({
          hangout,
          dispatch,
          name: username,
          dState: "unread",
        });
        saveUnread({ dispatch, name: username, hangout });
        break;
      case hangoutStates.BLOCKER:
        // saveBlocker({
        //   dispatch,
        //   hangout,
        //   name: username,
        //   focusedHangout,
        //   onAppRoute,
        //   unread,
        // });
        break;
      case hangoutStates.DECLINER:
        debugger;
        updateHangout({ dispatch, name: username, hangout });
        break;
      case hangoutStates.INVITER:
        saveUnread({
          dispatch,
          hangout,
          name: username,
        });
        saveRecievedMessage({
          hangout,
          dispatch,
          name: username,
          dState: "unread",
        });
        break;
      case hangoutStates.MESSANGER:
        updateHangout({ dispatch, name: username, hangout });
        saveUnread({
          dispatch,
          hangout,
          name: username,
        });
        saveRecievedMessage({
          hangout,
          dispatch,
          name: username,
          dState: "unread",
        });
        break;
      case hangoutStates.UNBLOCKER:
        // saveUnblocker({
        //   dispatch,
        //   hangout,
        //   name: username,
        //   focusedHangout,
        //   onAppRoute,
        //   unread,
        // });
        break;
      case hangoutStates.READER:
        break;
      default:
        break;
    }
  }

  function handleHangouts({ hangouts }) {
    hangouts.forEach((hangout) => {
      onHangout({ hangout, unread: true });
    });
  }

  useEffect(() => {
    if (message && username) {
      switch (message.type) {
        case "ACKHOWLEDGEMENT":
          handleAcknowledgement({ hangout: message.hangout, offline: false });
          break;
        case "HANGOUT":
          if (
            focusedHangout &&
            focusedHangout.username === message.hangout.username
          ) {
            onHangout({ hangout: message.hangout, unread: false });
          } else {
            onHangout({ hangout: message.hangout, unread: true });
          }
          break;
        case "UNREAD_HANGOUTS":
          handleHangouts({ hangouts: message.hangouts });
          break;
        case "OFFLINE_ACKN":
          handleAcknowledgement({ hangout: message.hangout, offline: true });
          break;
        default:
          break;
      }
    }
  }, [message, username]);

  return {};
}
