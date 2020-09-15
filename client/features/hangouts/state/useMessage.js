import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import { useEffect } from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import { useAppRoute } from "components/app-route/index";
import { actionTypes } from "./actionTypes";

import {
  updateSentMessage,
  saveUnread,
  saveHangout,
  saveSentMessage,
  saveRecievedMessage,
  updateHangout,
  removeUnreads,
} from "./local-storage/common";

export function useMessage({
  message,
  username,
  dispatch,
  focusedHangout,
  browserId,
}) {
  const { onAppRoute } = useAppRoute();

  function onDeliveryAcknowledgement({ hangout, offline }) {
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
        }, 0);

        break;
      case "INVITED":
        debugger;
        setTimeout(function () {
          if (browserId === hangout.browserId) {
            debugger;
            updateHangout(commonArg);
            updateSentMessage(commonArg);
          } else {
            debugger;
            saveHangout({ hangout, dispatch, name: username });
            saveSentMessage({ hangout, dispatch, name, dState: "delivered" });
          }

          dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
        }, 200);

        break;
      case "DECLINED":
        setTimeout(function () {
          dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
        }, 200);

        break;
      case "ACCEPTED":
        setTimeout(function () {
          updateHangout(commonArg);
          updateSentMessage(commonArg);
          dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
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

      default:
        break;
    }
  }

  function onHangout({ hangout }) {
    const commonArg = { dispatch, name: username, hangout };
    switch (hangout.state) {
      case "ACCEPTER":
        updateHangout(commonArg);
        saveRecievedMessage({
          hangout,
          dispatch,
          name: username,
          dState: "unread",
        });
        saveUnread(commonArg);
        break;
      case "BLOCKER":
        updateHangout(commonArg);

        removeUnreads(commonArg);
        break;
      case "DECLINER":
        updateHangout(commonArg);
        break;
      case "INVITER":
        saveUnread(commonArg);

        break;
      case "MESSANGER":
        //FIXME GH focused hangout issue

        updateHangout(commonArg);
        saveRecievedMessage({
          hangout,
          dispatch,
          name: username,
          dState: "unread",
        });
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
  function handleDelayedAcknowledgements({ hangouts }) {
    hangouts.forEach((hangout) => {
      onDeliveryAcknowledgement({ hangout });
    });
  }
  useEffect(() => {
    if (message && message.type === "HANGOUT" && username) {
      const { data } = message;
      switch (message.data.type) {
        case "DELAYED_ACKHOWLEDGEMENTS":
          dispatch({
            type: actionTypes.ON_SOCKET_MESSAGE,
            on_socket_message: true,
          });

          handleDelayedAcknowledgements({ hangouts: data.hangouts });
          setTimeout(() => {
            dispatch({
              type: actionTypes.ON_SOCKET_MESSAGE,
              on_socket_message: false,
            });
          }, 0);
          break;
        case "ACKHOWLEDGEMENT":
          dispatch({
            type: actionTypes.ON_SOCKET_MESSAGE,
            on_socket_message: true,
          });

          onDeliveryAcknowledgement({
            hangout: data.hangout,
            offline: false,
          });
          setTimeout(() => {
            dispatch({
              type: actionTypes.ON_SOCKET_MESSAGE,
              on_socket_message: false,
            });
          }, 0);
          break;
        case "HANGOUT":
          dispatch({
            type: actionTypes.ON_SOCKET_MESSAGE,
            on_socket_message: true,
          });

          if (
            focusedHangout &&
            focusedHangout.username === data.hangout.username
          ) {
            onHangout({ hangout: data.hangout, unread: false });
          } else {
            onHangout({ hangout: data.hangout, unread: true });
          }
          setTimeout(() => {
            dispatch({
              type: actionTypes.ON_SOCKET_MESSAGE,
              on_socket_message: false,
            });
          }, 0);
          break;
        case "UNDELIVERED_HANGOUTS":
          dispatch({
            type: actionTypes.ON_SOCKET_MESSAGE,
            on_socket_message: true,
          });
          handleHangouts({ hangouts: data.hangouts });
          setTimeout(() => {
            dispatch({
              type: actionTypes.ON_SOCKET_MESSAGE,
              on_socket_message: false,
            });
          }, 0);
          break;
        // case "OFFLINE_ACKN":
        //   onDeliveryAcknowledgement({
        //     hangout: message.hangout,
        //     offline: true,
        //   });
        //  break;
        default:
          break;
      }
    }
  }, [message, username]);

  return {};
}
