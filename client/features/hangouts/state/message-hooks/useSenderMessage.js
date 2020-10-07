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
      username &&
      message.data.sender !== username
    ) {
      const {
        data: { hangout },
      } = message;
      handleSenderHangout({ hangout });
    }
    if (
      message &&
      message.type === "HANGOUT" &&
      message.data.type === "UNDELIVERED_HANGOUTS" &&
      username &&
      message.data.sender !== username
    ) {
      const {
        data: { hangouts },
      } = message;
      hangouts.forEach((hangout) => {
        handleSenderHangout({ hangout });
      });
    }
  }, [message, username]);

  function handleSenderHangout({ hangout }) {
    const commonArg = { dispatch, username, hangout };
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
  }
}
