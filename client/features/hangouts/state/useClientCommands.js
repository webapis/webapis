import {
  useContext,
  useMemo,
  useReducer,
  useEffect,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import { clientCommands } from "./clientCommands";
import {
  loadMessages,
  removeUnreads,
  updateRecievedMessages,
  updateRecievedMessage,
  saveHangout,
  saveSentMessage,
  saveRecievedMessage,
  removeUnread,
  updateHangout,
  saveOfflineSentHangout,
} from "./local-storage/common";
import { useAppRoute } from "../../../components/app-route/index";
import { actionTypes } from "./actionTypes";
export default function useClientCommands({
  state,
  sendMessage,
  user,
  browserId,
  dispatch,
}) {
  const { socketConnected } = state;
  const { onAppRoute } = useAppRoute();
  const { hangout, sendhangout, on_user_client_command, messageText } = state;

  function onHangout({ command }) {
    try {
      const timestamp = Date.now();
      const { email, state } = hangout;

      const { username } = user;
      const newhangout = {
        target: hangout.target,
        email,
        message: {
          text: messageText,
          timestamp,
          type: state === "BLOCKER" ? state : command,
        },
        command,
        timestamp,
        browserId,
      };
      if (command === "INVITE") {
        updateHangout({
          dispatch,
          username,
          hangout: { ...newhangout, state: "INVITE", command: undefined },
        });
        // dispatch({
        //   type: actionTypes.SELECTED_HANGOUT,
        //   hangout: newhangout,
        // });
      }
      if (state !== "BLOCKER") {
        saveSentMessage({
          hangout: newhangout,
          dispatch,
          username,
          dState: socketConnected ? "pending" : "offline",
        });
      }
      if (state === "BLOCKER") {
        saveSentMessage({
          hangout: newhangout,
          dispatch,
          username,
          dState: "blocked",
        });
      }
      if (socketConnected && state !== "BLOCKER") {
        sendMessage({
          data: {
            type: "HANGOUT",
            hangout: newhangout,
            sender: username,
          },
          type: "HANGOUT",
        });
      } else if (!socketConnected && state !== "BLOCKER") {
        saveOfflineSentHangout({
          hangout: newhangout,
          username,
        });
      }
    } catch (error) {}
  }
  useEffect(() => {
    if (on_user_client_command && user && hangout && sendhangout) {
      onHangout({ command: on_user_client_command });
      clientCommandFulfilled();
    }
  }, [on_user_client_command, user, hangout, sendhangout]);
  function clientCommandFulfilled() {
    dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
  }
  return {};
}
