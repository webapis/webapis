import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useEffect,
  useState,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cbdf6161bd8ca09a385d62c8c697bd1cd87bb184/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { useHangouts } from "../../state/useHangouts";
import * as actions from "./actions";
import { actionTypes } from "../../state/actionTypes";
import { useUserName } from "features/authentication/state/useUserName";
import { useAuth } from "features/authentication/index";
import useOnlineStatus from "components/browser-api/online-status/index";

const html = htm.bind(h);
export function WebSocketContainer(props) {
  const { state: authState } = useAuth();
  const { username, token } = useUserName();
  const [socket, setSocket] = useState(null);
  const { onlineStatus } = useOnlineStatus();
  const { children, socketUrl } = props;
  const { dispatch, state } = useHangouts();
  const {
    searchHangouts,
    search,
    pendingHangout,
    fetchHangouts,
    readyState,
  } = state;

  useEffect(() => {
    if (username && username.length > 0 && socket === null) {
      setSocket(new WebSocket(`${socketUrl}/hangouts/?username=${username}`));
      console.log("set to init state.");
      dispatch({ type: actionTypes.SOCKET_READY });
    }
    if (!username && socket) {
      console.log("socket close");

      //  setSocket(null);
      //  dispatch({ type: actionTypes.SET_HANGOUT_TO_INIT_STATE });
    }
  }, [username, socket]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (serverMessage) => {
        const msg = JSON.parse(serverMessage.data);
        dispatch({ type: actionTypes.SERVER_MESSAGE_RECIEVED, message: msg });
      };
      socket.onopen = () => {
        console.log("con open");
        dispatch({ type: actionTypes.OPEN });
      };
      socket.onclose = () => {
        console.log("con closed");
        // setSocket(null);
        dispatch({ type: actionTypes.CLOSED });
      };
      socket.onerror = (error) => {
        dispatch({ type: actionTypes.SOCKET_ERROR, error });
        throw error;
      };
    }
  }, [socket]);

  useEffect(() => {
    if (searchHangouts) {
      //2.
      actions.searchHangouts({ dispatch, search, username });
    }
  }, [searchHangouts]);

  useEffect(() => {
    if (pendingHangout && readyState === 1) {
      sendPendingHangout();
    }
  }, [pendingHangout, readyState]);

  useEffect(() => {
    if (fetchHangouts && username) {
      actions.findHangouts({ dispatch, username });
    }
  }, [fetchHangouts, username]);
  function sendPendingHangout() {
    socket.send(JSON.stringify(pendingHangout));
  }
  return html`${children}`;
}
