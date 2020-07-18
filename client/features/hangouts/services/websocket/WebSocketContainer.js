import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { useHangouts } from "../../state/useHangouts";
import * as actions from "./actions";
import { actionTypes } from "../../state/actionTypes";
import { useUserName } from "features/authentication/state/useUserName";
import { useAuth } from "features/authentication";
import useOnlineStatus from "components/browser-api/online-status";
import { useApplication } from "components/app-provider";
export function WebSocketContainer(props) {
  const { displayError } = useApplication();
  const { state: authState } = useAuth();
  const { username, token } = useUserName();
  const [socket, setSocket] = useState(null);
  const { onlineStatus } = useOnlineStatus();
  const { children, socketUrl } = props;
  const { dispatch, state } = useHangouts();
  const { searchHangouts, search, pendingHangout, fetchHangouts } = state;

  useEffect(() => {
    if (username && socket === null && onlineStatus) {
      setSocket(new WebSocket(`${socketUrl}/hangouts/?username=${username}`));
      console.log("set to init state.");
      dispatch({ type: actionTypes.SOCKET_READY });
    }
    if (!username && socket) {
      console.log("socket close");

      setSocket(null);
      dispatch({ type: actionTypes.SET_HANGOUT_TO_INIT_STATE });
    }
  }, [username, socket, onlineStatus]);

  useEffect(() => {
    try {
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
          setSocket(null);
          dispatch({ type: actionTypes.CLOSED });
        };
        socket.onerror = (error) => {
          debugger;
          dispatch({ type: actionTypes.SOCKET_ERROR, error });
          displayError({ error });
        };
      }
    } catch (error) {
      displayError({ error });
    }
  }, [socket]);

  useEffect(() => {
    if (searchHangouts) {
      //2.
      actions.searchHangouts({ dispatch, search, username });
    }
  }, [searchHangouts]);

  useEffect(() => {
    if (pendingHangout) {
      sendPendingHangout();
    }
  }, [pendingHangout]);

  useEffect(() => {
    if (fetchHangouts && username) {
      actions.findHangouts({ dispatch, username });
    }
  }, [fetchHangouts, username]);
  function sendPendingHangout() {
    try {
      socket.send(JSON.stringify(pendingHangout));
      dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
    } catch (error) {
      displayError({ error });
    }
  }
  return children;
}
