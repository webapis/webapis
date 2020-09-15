import { useEffect } from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import {
  updateSentMessage,
  saveUnread,
  saveHangout,
  saveSentMessage,
  saveRecievedMessage,
  updateHangout,
  removeUnreads,
} from "../local-storage/common";
export default function useDeliveryAcknowledgement({
  hangout,
  dispatch,
  username,
}) {
  useEffect(() => {
    debugger;
    if (hangout) {
      onDeliveryAcknowledgement();
    }
  }, [hangout]);

  function handleDelayedAcknowledgements({ hangouts }) {
    hangouts.forEach((hangout) => {
      onDeliveryAcknowledgement({ hangout });
    });
  }

  function onDeliveryAcknowledgement() {
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
            updateHangout(commonArg);
            updateSentMessage(commonArg);
          } else {
            saveHangout({ hangout, dispatch, name: username });
            updateSentMessage({ hangout, dispatch, name, dState: "delivered" });
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
}
