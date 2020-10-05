import { useEffect } from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import {
  updateSentMessage,
  saveUnread,
  saveHangout,
  saveSentMessage,
  saveRecievedMessage,
  updateHangout,
  removeUnreads,
  removeOfflineSentHangouts,
} from "../local-storage/common";
import { actionTypes } from "../actionTypes";
export default function useDeliveryAcknowledgement({
  message,
  dispatch,
  username,
  browserId,
}) {
  useEffect(() => {
    if (
      message &&
      message.type === "HANGOUT" &&
      message.data.type === "ACKHOWLEDGEMENT" &&
      username &&
      message.data.sender === username
    ) {
      const {
        data: { hangout },
      } = message;

      onDeliveryAcknowledgement({ hangout });
    }
  }, [message, username]);
  useEffect(() => {
    if (
      message &&
      message.type === "HANGOUT" &&
      message.data.type === "OFFLINE_ACKHOWLEDGEMENT" &&
      username &&
      message.data.sender === username
    ) {
      const {
        data: { hangouts },
      } = message;
      hangouts.forEach((d) => {
        const { hangout } = d.data;

        onDeliveryAcknowledgement({ hangout });
      });

      removeOfflineSentHangouts({ username });
    }
  }, [message, username]);
  useEffect(() => {
    if (
      message &&
      message.type === "HANGOUT" &&
      message.data.type === "DELAYED_ACKHOWLEDGEMENT" &&
      username &&
      message.data.sender === username
    ) {
      const {
        data: { hangouts },
      } = message;
      hangouts.forEach((hangout) => {
        onDeliveryAcknowledgement({ hangout });
      });
    }
  }, [message, username]);

  function onDeliveryAcknowledgement({ hangout }) {
    const commonArg = { dispatch, username, hangout };

    switch (hangout.state) {
      case "UNDECLINED":
        setTimeout(function () {
          updateHangout({ hangout, dispatch, username });
        }, 0);
        break;
      case "UNBLOCKED":
        setTimeout(function () {
          updateHangout({ hangout, dispatch, username });
        }, 0);

        break;
      case "INVITED":
        setTimeout(function () {
          if (browserId === hangout.browserId) {
            updateHangout({ hangout, dispatch, username });

            updateSentMessage({
              hangout,
              dispatch,
              username,
              dState: "delivered",
            });
          } else {
            saveHangout({ hangout, dispatch, username });
            saveSentMessage({
              hangout,
              dispatch,
              username,
              dState: "delivered",
            });
          }
        }, 200);
        // dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
        break;
      case "DECLINED":
        setTimeout(function () {
          updateHangout({ hangout, dispatch, username });
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
          // onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
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
}