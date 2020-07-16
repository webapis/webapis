import { actionTypes } from "../../actionTypes";
import saveUnreadInvitation from "./saveUnreadHangout";
import updateReadInvitation from "./updateReadHangout";
// export default function saveRecievedInvitation({ dispatch, hangout, name }) {
//   const { message, username } = hangout;
//   const hangoutKey = `${name}-hangouts`;
//   const recievedInvitation = { ...hangout, dState: "unread" };
//   const localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
//   if (localHangouts && localHangouts.length > 0) {
//     localStorage.setItem(
//       hangoutKey,
//       JSON.stringify([...localHangouts, recievedInvitation])
//     );
//     dispatch({
//       type: actionTypes.HANGOUTS_UPDATED,
//       hangouts: [...localHangouts, recievedInvitation],
//     });
//   } else {
//     localStorage.setItem(hangoutKey, JSON.stringify([recievedInvitation]));
//     dispatch({
//       type: actionTypes.HANGOUTS_UPDATED,
//       hangouts: [recievedInvitation],
//     });
//   }

//   if (message) {
//     const messageKey = `${name}-${username}-messages`;
//     const recievedMessage = { ...message, username, state: "unread" };
//     dispatch({
//       type: actionTypes.MESSAGES_UPDATED,
//       messages: [recievedMessage],
//     });
//     localStorage.setItem(messageKey, JSON.stringify([recievedMessage]));
//     dispatch({
//       type: actionTypes.MESSAGES_UPDATED,
//       messages: [recievedMessage],
//     });
//   }

//   saveUnreadInvitation({ dispatch, name, hangout });
// }

export function removeUnreadInvitation({ hangout, dispatch, name }) {
  const { username, timestamp } = hangout;
  const hangoutKey = `${name}-unread-hangouts`;
  let localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
  const hangoutIndex = localHangouts.findIndex(
    (f) => f.username === username && f.timestamp === timestamp
  );
  localHangouts.splice(hangoutIndex, 1);
  localStorage.setItem(hangoutKey, JSON.stringify(localHangouts));
  dispatch({
    type: actionTypes.UNREAD_HANGOUTS_UPDATED,
    unreadhangouts: localHangouts,
  });
}

// export function updateReadInvitation({dispatch,hangout,name}){
//   const { username, timestamp } = hangout;
//   const hangoutKey = `${name}-unread-hangouts`;
//   const respondedInvitation ={...hangout,dState:'read'}
//   let localHangouts = JSON.parse(localStorage.getItem(hangoutKey));
//   const hangoutIndex = localHangouts.findIndex(
//     (f) => f.username === username && f.timestamp === timestamp
//   );
//   localHangouts.splice(hangoutIndex, 1,respondedInvitation);
//   localStorage.setItem(hangoutKey, JSON.stringify(localHangouts));
//   dispatch({
//     type: actionTypes.UNREAD_HANGOUTS_UPDATED,
//     unreadhangouts: localHangouts,
//   });
// }
