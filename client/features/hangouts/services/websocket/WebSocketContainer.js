import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useEffect,
  useState,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
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
  const { searchHangouts, search, pendingHangout, fetchHangouts } = state;
  const { signout, browserId, authenticated } = authState;

  function onSocket() {
    setSocket(
      new WebSocket(
        `${socketUrl}/hangouts/?username=${username}&browserId=${browserId}`
      )
    );
    console.log("set to init state.");
    dispatch({ type: actionTypes.SOCKET_READY });
  }

  useEffect(() => {
    if (browserId) {
    }
    if (username && username.length > 0 && browserId && socket === null) {
      onSocket();
    }
    if (!username && socket) {
      console.log("socket close");

      setSocket(null);
      dispatch({ type: actionTypes.SET_HANGOUT_TO_INIT_STATE });
    }
  }, [username, socket, browserId]);

  useEffect(() => {
    if (authenticated) {
      onSocket();
    }
  }, [authenticated]);
  useEffect(() => {
    if (signout) {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [signout]);
  useEffect(() => {
    if (socket) {
      socket.onmessage = (serverMessage) => {
        const msg = JSON.parse(serverMessage.data);
        dispatch({ type: actionTypes.SERVER_MESSAGE_RECIEVED, message: msg });
      };
      socket.onopen = () => {
        debugger;
        console.log("con open");
        dispatch({ type: actionTypes.OPEN });
      };
      socket.onclose = () => {
        console.log("con closed");
        setSocket(null);
        dispatch({ type: actionTypes.CLOSED });
      };
      socket.onerror = (error) => {
        const err = error.message;
        //
        dispatch({ type: actionTypes.SOCKET_ERROR, error });
        //   throw error;
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
    if (pendingHangout && socket && socket.readyState === 1) {
      sendPendingHangout();
    }
  }, [pendingHangout, socket]);

  useEffect(() => {
    if (fetchHangouts && username) {
      debugger;
      actions.findHangouts({ dispatch, username });
    }
  }, [fetchHangouts, username]);
  function sendPendingHangout() {
    socket.send(JSON.stringify({ ...pendingHangout, browserId }));
  }
  return html`${children}`;
}
