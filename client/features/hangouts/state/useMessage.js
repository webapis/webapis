import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import { useEffect } from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import { useAppRoute } from "components/app-route/index";
import { actionTypes } from "./actionTypes";
import {
  updateSentMessage,
  saveUnread,
  saveHangout,
  saveRecievedMessage,
  updateHangout,
  removeUnread,
  updateRecievedMessages,
  removeUnreads,
} from "./local-storage/common";

export function useMessage({ message, username, dispatch, focusedHangout }) {
  const { onAppRoute } = useAppRoute();
  function handleAcknowledgement({ hangout, offline }) {
    const commonArg = { dispatch, name: username, hangout };
    switch (hangout.state) {
      case "UNBLOCKED":
        setTimeout(function () {
          // saveUnblovked({
          //   dispatch,
          //   hangout,
          //   name: username,
          //   focusedHangout,
          //   onAppRoute,
          //   offline,
          // });
        }, 200);

        break;
      case "INVITED":
        setTimeout(function () {
          saveHangout(commonArg);
          updateSentMessage(commonArg);
          dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
          onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
        }, 200);

        break;
      case "DECLINED":
        setTimeout(function () {
          removeUnread(commonArg);
          dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
          onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
        }, 200);

        break;
      case "ACCEPTED":
        setTimeout(function () {
          saveHangout(commonArg);
          updateSentMessage(commonArg);
          dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
          onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
        }, 200);

        break;
      case "BLOCKED":
        setTimeout(function () {
          updateHangout(commonArg);
          updateSentMessage(commonArg);
          removeUnreads(commonArg);
          dispatch({ type: actionTypes.HANGOUT_UPDATED, hangout });
          dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
          onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
        }, 200);

        break;
      case "MESSAGED":
        setTimeout(function () {
          updateHangout(commonArg);
          updateSentMessage(commonArg);
          dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
        }, 200);

        break;
      case "READ":
        setTimeout(function () {
          updateHangout({
            hangout: { ...focusedHangout, state: "READ" },
            name: username,
            dispatch,
          });
          updateRecievedMessages(commonArg);
          dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
          // removeUnread(commonArg);
        }, 200);

        break;
      default:
        break;
    }
  }

  function onHangout({ hangout }) {
    const commonArg = { dispatch, name: username, hangout };
    switch (hangout.state) {
      case "ACCEPTER":
        updateHangout(commonArg);
        saveRecievedMessage(commonArg);
        saveUnread(commonArg);
        break;
      case "BLOCKER":
        updateHangout(commonArg);
        dispatch({ type: actionTypes.HANGOUT_UPDATED, hangout });
        removeUnreads(commonArg);
        break;
      case "DECLINER":
        updateHangout(commonArg);
        break;
      case "INVITER":
        saveUnread(commonArg);
        saveRecievedMessage(commonArg);
        break;
      case "MESSANGER":
        //FIXME GH focused hangout issue
        updateHangout(commonArg);
        saveRecievedMessage(commonArg);
        if (!focusedHangout) {
          saveUnread(commonArg);
        } else {
          if (focusedHangout && focusedHangout.username !== hangout.username) {
            saveUnread(commonArg);
          }
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
