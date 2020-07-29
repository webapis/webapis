import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import { useEffect } from "https://cdn.jsdelivr.net/gh/webapis/webapis@cbdf6161bd8ca09a385d62c8c697bd1cd87bb184/hooks.cdn.js";
import { useAppRoute } from "components/app-route/index";
import { actionTypes } from "./actionTypes";
import {
  updateSentMessage,
  saveUnread,
  saveRecievedMessage,
  updateHangout,
  removeUnread,
  removeUnreads,
  updateUnread,
} from "./local-storage/common";
export function useMessage({ message, username, dispatch, focusedHangout }) {
  const { onAppRoute } = useAppRoute();
  function handleAcknowledgement({ hangout, offline }) {
    switch (hangout.state) {
      case "UNBLOCKED":
        setTimeout(function () {
          saveUnblovked({
            dispatch,
            hangout,
            name: username,
            focusedHangout,
            onAppRoute,
            offline,
          });
        }, 200);

        break;
      case "INVITED":
        setTimeout(function () {
          updateHangout({ dispatch, hangout, name: username });
          updateSentMessage({
            hangout,
            name: username,
            dispatch,
            dState: "delivered",
          });
          dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
          onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
        }, 200);

        break;
      case "DECLINED":
        setTimeout(function () {
          // updateUnread({
          //   dispatch,
          //   hangout,
          //   name: username,
          //   dState: "DECLINED",
          // });
          removeUnread({ dispatch, hangout, name: username });
          updateSentMessage({ hangout, name: username, dispatch });
          dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });

          onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
        }, 200);

        break;
      case "ACCEPTED":
        setTimeout(function () {
          removeUnread({ dispatch, hangout, name: username });
          updateHangout({ dispatch, hangout, name: username });
          updateSentMessage({
            hangout,
            name: username,
            dispatch,
            dState: "delivered",
          });
          dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
          onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
        }, 200);

        break;
      case "BLOCKED":
        setTimeout(function () {
          updateHangout({ dispatch, hangout, name: username });
          updateSentMessage({ hangout, name: username, dispatch });
          removeUnreads({ dispatch, name });
          dispatch({ type: actionTypes.HANGOUT_UPDATED, hangout });
          dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
          onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
        }, 200);

        break;
      case "MESSAGED":
        setTimeout(function () {
          updateHangout({ dispatch, name: username, hangout });
          updateSentMessage({
            hangout,
            name: username,
            dispatch,
            dState: "delivered",
          });
          dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
        }, 200);

        break;
      case "READ":
        setTimeout(function () {
          updateHangout({ dispatch, name: username, hangout });
          dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
          removeUnread({ dispatch, hangout, name: username });
        }, 200);

        break;
      default:
        break;
    }
  }

  function onHangout({ hangout }) {
    switch (hangout.state) {
      case "ACCEPTER":
        updateHangout({ dispatch, name: username, hangout });
        saveRecievedMessage({
          hangout,
          dispatch,
          name: username,
          dState: "unread",
        });
        saveUnread({ dispatch, name: username, hangout, dState: "ACCEPTER" });
        break;
      case "BLOCKER":
        updateHangout({ dispatch, name: username, hangout });
        dispatch({ type: actionTypes.HANGOUT_UPDATED, hangout });
        removeUnreads({ dispatch, name });
        break;
      case "DECLINER":
        updateHangout({ dispatch, name: username, hangout });
        break;
      case "INVITER":
        saveUnread({
          dispatch,
          hangout,
          name: username,
          dState: "INVITER",
        });
        saveRecievedMessage({
          hangout,
          dispatch,
          name: username,
          dState: "unread",
        });
        break;
      case "MESSANGER":
        updateHangout({ dispatch, name: username, hangout });
        saveRecievedMessage({
          hangout,
          dispatch,
          name: username,
          dState: "unread",
        });

        if (focusedHangout && focusedHangout.username !== hangout.username) {
          saveUnread({
            dispatch,
            hangout,
            name: username,
            dState: "unread",
          });
        }

        break;
      case "UNBLOCKER":
        // saveUnblocker({
        //   dispatch,
        //   hangout,
        //   name: username,
        //   focusedHangout,
        //   onAppRoute,
        //   unread,
        // });
        break;
      case "READER":
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
