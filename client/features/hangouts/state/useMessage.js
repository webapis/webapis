import { h } from "preact";
import { useEffect } from "preact/hooks";
import { useAppRoute } from "components/app-route";
import { hangoutStates } from "server/hangouts/hangoutStates";
// import {
//   saveInvited,
//   saveUnblovked,
//   saveDeclined,
//   saveBlocked,
//   saveAccepted,
//   saveMessaged,
// } from "./actions/delivering-actions";
// import {
//   saveAccepter,
//   saveBlocker,
//   saveDecliner,
//   saveInviter,
//   saveMessanger,
//   saveUnblocker,
// } from "./actions/recieving-actions";
import { updateDeliveredInvitation } from "./local-storage/local/saveSentInvitation";
import saveRecievedInvitation, {
  updateDeliveredAccept,
} from "./local-storage/remote/saveRecievedInvitation";
export function useMessage({ message, username, dispatch, focusedHangout }) {
  const { onAppRoute } = useAppRoute();
  function handleAcknowledgement({ hangout, offline }) {
    switch (hangout.state) {
      case hangoutStates.INVITED:
        updateDeliveredInvitation({
          dispatch,
          hangout,
          name: username,
          onAppRoute,
        });
        break;
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
      case hangoutStates.DECLINED:
        // saveDeclined({
        //   dispatch,
        //   hangout,
        //   name: username,
        //   focusedHangout,
        //   onAppRoute,
        //   offline,
        // });
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
      case hangoutStates.ACCEPTED:
        updateDeliveredAccept({
          dispatch,
          hangout,
          name: username,
          onAppRoute,
        });

        break;
      case hangoutStates.MESSAGED:
        // saveMessaged({
        //   dispatch,
        //   hangout,
        //   name: username,
        //   focusedHangout,
        //   onAppRoute,
        //   offline,
        // });
        break;
      default:
        break;
    }
  }

  function onHangout({ hangout, unread }) {
    switch (hangout.state) {
      case hangoutStates.ACCEPTER:
        // saveAccepter({
        //   dispatch,
        //   hangout,
        //   name: username,
        //   focusedHangout,
        //   onAppRoute,
        //   unread,
        // });
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
        // saveDecliner({
        //   dispatch,
        //   hangout,
        //   name: username,
        //   focusedHangout,
        //   onAppRoute,
        //   unread,
        // });
        break;
      case hangoutStates.INVITER:
        saveRecievedInvitation({
          dispatch,
          hangout,
          name: username,
        });
        break;
      case hangoutStates.MESSANGER:
        // saveMessanger({
        //   dispatch,
        //   hangout,
        //   name: username,
        //   focusedHangout,
        //   onAppRoute,
        //   unread,
        // });
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
          debugger;
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
