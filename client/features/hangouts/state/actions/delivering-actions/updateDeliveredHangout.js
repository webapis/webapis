// import { actionTypes } from "../../actionTypes";
// export function updateDeliveredHangout({
//   name,
//   dispatch,
//   hangout,
//   offline,
//   onAppRoute,
// }) {
//   const { username, message, timestamp } = hangout;

//   const deliveredHangout = { ...hangout, delivered: true };
//   const hangoutKey = `${name}-hangouts`;
//   const hangouts = JSON.parse(localStorage.getItem(hangoutKey));
//   const hangoutIndex = hangouts.findIndex((g) => g.username === username);
//   let updatedHangouts = null;
//   hangouts.splice(hangoutIndex, 1, deliveredHangout);
//   localStorage.setItem(hangoutKey, JSON.stringify(hangouts));
//   dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts });
//   dispatch({ type: actionTypes.HANGOUT_UPDATED, hangout: deliveredHangout });
//   if (message) {
//     updateDeliveredMessage({ dispatch, name, deliveredHangout, hangout });
//   }
//   if (hangout.state === "BLOCKED") {
//     updateBockedState({ dispatch, name, deliveredHangout });
//   }
//   if (offline) {
//     //remove offline hangout
//     const offlineHangoutKey = `${name}-offline-hangouts`;
//     const offlinehangouts = JSON.parse(localStorage.getItem(offlineHangoutKey));

//     if (offlinehangouts) {
//       const hangoutIndex = offlinehangouts.findIndex(
//         (o) => o.timestamp === timestamp
//       );
//       localStorage.setItem(
//         offlineHangoutKey,
//         JSON.stringify(offlinehangouts.splice(hangoutIndex, 1))
//       );
//     }
//   }

//   if (hangout.state !== "MESSANGER") {
//     onAppRoute({ featureRoute: `/${hangout.state}`, route: "/hangouts" });
//   }
// }

// export function updateDeliveredMessage({ dispatch, name, deliveredHangout }) {
//   const { username, message } = deliveredHangout;

//   const deliveredMessage = { ...message, username: name, delivered: true };

//   // save message to localStorage
//   const messageKey = `${name}-${username}-messages`;
//   const messages = JSON.parse(localStorage.getItem(messageKey));
//   const hangoutIndex = messages.findIndex(
//     (m) => m.timestamp === message.timestamp
//   );
//   messages.splice(hangoutIndex, 1, deliveredMessage);

//   localStorage.setItem(messageKey, JSON.stringify(messages));

//   dispatch({ type: actionTypes.MESSAGES_UPDATED, messages });
// }

// export function updateBockedState({ dispatch, deliveredHangout, name }) {
//   const { username } = deliveredHangout;
//   const blockedMessage = {
//     timestamp: deliveredHangout.timestamp,
//     text: "you blocked this user",
//     username: name,
//     type: "blocked",
//   };
//   const messageKey = `${name}-${username}-messages`;
//   const messages = JSON.parse(localStorage.getItem(messageKey));

//   localStorage.setItem(
//     messageKey,
//     JSON.stringify([...messages, blockedMessage])
//   );

//   dispatch({
//     type: actionTypes.MESSAGES_UPDATED,
//     messages: [...messages, blockedMessage],
//   });
// }
