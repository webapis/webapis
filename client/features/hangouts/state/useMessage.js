import { h } from "preact";
import { useEffect } from "preact/hooks";
import { useAppRoute } from "components/app-route";
import { hangoutStates } from "server/hangouts/hangoutStates";
import { actionTypes } from "./actionTypes";
import { useApplication } from "components/app-provider";
import {
  updateSentMessage,
  saveUnread,
  saveRecievedMessage,
  updateHangout,
  removeUnread,
  removeUnreads,
} from "./local-storage/common";
export function useMessage({ message, username, dispatch, focusedHangout }) {
  const { displayError } = useApplication();
  const { onAppRoute } = useAppRoute();
  function handleAcknowledgement({ hangout, offline }) {
    try {
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
          removeUnread({ dispatch, hangout, name: username });
          updateSentMessage({ hangout, name: username, dispatch });
          dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
          onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
          break;
        case hangoutStates.ACCEPTED:
          removeUnread({ dispatch, hangout, name: username });
          updateHangout({ dispatch, hangout, name: username });
          updateSentMessage({ hangout, name: username, dispatch });
          dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
          onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
          break;
        case hangoutStates.BLOCKED:
          updateHangout({ dispatch, hangout, name: username });
          updateSentMessage({ hangout, name: username, dispatch });
          removeUnreads({ dispatch, name });
          dispatch({ type: actionTypes.HANGOUT_UPDATED, hangout });
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
          removeUnread({ dispatch, hangout, name: username });
          break;
        default:
          break;
      }
    } catch (error) {
      displayError({ error });
    }
  }

  function onHangout({ hangout }) {
    try {
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
          dispatch({ type: actionTypes.HANGOUT_UPDATED, hangout });
          removeUnreads({ dispatch, name });
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
          if (focusedHangout && focusedHangout.username !== hangout.username) {
            saveUnread({
              dispatch,
              hangout,
              name: username,
              dState: "unread",
            });
          }

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
    } catch (error) {
      displayError({ error });
    }
  }

  function handleHangouts({ hangouts }) {
    try {
      hangouts.forEach((hangout) => {
        onHangout({ hangout, unread: true });
      });
    } catch (error) {
      displayError({ error });
    }
  }

  useEffect(() => {
    if (message && username) {
      try {
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
      } catch (error) {
        displayError({ error });
      }
    }
  }, [message, username]);

  return {};
}
