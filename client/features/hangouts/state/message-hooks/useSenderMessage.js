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
export default function useSenderMessage({
  message,
  dispatch,
  username,
  focusedHangout,
}) {
  useEffect(() => {
    if (
      message &&
      message.type === "HANGOUT" &&
      message.data.type === "HANGOUT" &&
      username
    ) {
      const {
        data: { hangout },
      } = message;

      const commonArg = { dispatch, username, hangout };
      switch (hangout.state) {
        case "ACCEPTER":
          updateHangout(commonArg);
          saveRecievedMessage({
            hangout,
            dispatch,
            username,
            dState:
              focusedHangout && focusedHangout.target === hangout.target
                ? "read"
                : "unread",
          });
          if (
            !focusedHangout ||
            (focusedHangout && focusedHangout.target !== hangout.target)
          ) {
            saveUnread(commonArg);
          }
          break;
        case "BLOCKER":
          updateHangout(commonArg);
          removeUnreads(commonArg);
          break;
        case "DECLINER":
          updateHangout(commonArg);
          break;
        case "INVITER":
          saveHangout({ hangout, dispatch, username });
          saveRecievedMessage({
            hangout,
            dispatch,
            username,
            dState: "unread",
          });
          saveUnread(commonArg);

          break;
        case "MESSANGER":
          //FIXME GH focused hangout issue

          updateHangout(commonArg);
          saveRecievedMessage({
            hangout,
            dispatch,
            username,
            dState:
              focusedHangout && focusedHangout.target === hangout.target
                ? "read"
                : "unread",
          });
          if (
            !focusedHangout ||
            (focusedHangout && focusedHangout.target !== hangout.target)
          ) {
            saveUnread(commonArg);
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
  }, [message, username]);
}