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
        updateHangout({ dispatch, hangout, name: username });
        updateSentMessage({ hangout, name: username, dispatch });
        dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
        onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
        break;
      case hangoutStates.DECLINED:
        updateUnread({ dispatch, hangout, name: username, dState: "read" });
        updateSentMessage({ hangout, name: username, dispatch });
        dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
        onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
        break;
      case hangoutStates.ACCEPTED:
        updateUnread({ dispatch, hangout, name: username, dState: "read" });
        updateHangout({ dispatch, hangout, name: username });
        updateSentMessage({ hangout, name: username, dispatch });
        dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
        onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
        break;
      case hangoutStates.BLOCKED:
        updateHangout({ dispatch, hangout, name: username });
        updateSentMessage({ hangout, name: username, dispatch });
        dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
        onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
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
      case hangoutStates.READ:
        updateHangout({ dispatch, name: username, hangout });
        dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
        updateUnread({ dispatch, hangout, name: username, dState: "read" });
        break;
      default:
        break;
    }
  }

  function onHangout({ hangout }) {
    switch (hangout.state) {
      case hangoutStates.ACCEPTER:
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
        updateHangout({ dispatch, name: username, hangout });
        break;
      case hangoutStates.DECLINER:
        updateHangout({ dispatch, name: username, hangout });
        break;
      case hangoutStates.INVITER:
        saveUnread({
          dispatch,
          hangout,
          name: username,
          dState: "unread",
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
          dState: "unread",
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
