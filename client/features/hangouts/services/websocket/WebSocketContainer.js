import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { useHangouts } from "../../state/useHangouts";
import * as actions from "./actions";
import { actionTypes } from "../../state/actionTypes";
import { useUserName } from "features/authentication/state/useUserName";
import { useAuth } from "features/authentication";
export function WebSocketContainer(props) {
  const { state: authState } = useAuth();
  const { username, token } = useUserName();
  const [socket, setSocket] = useState(null);

  const { children, socketUrl } = props;
  const { dispatch, state } = useHangouts();
  const { searchHangouts, search, pendingHangout, fetchHangouts } = state;

  useEffect(() => {
    if (username && socket === null) {
      setSocket(new WebSocket(`${socketUrl}/hangouts/?username=${username}`));

      dispatch({ type: actionTypes.SOCKET_READY });
    }
    if (!username && socket) {
      socket.close();
      setSocket(null);
      dispatch({ type: actionTypes.SET_HANGOUT_TO_INIT_STATE });
    }
  }, [username, socket]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (serverMessage) => {
        const msg = JSON.parse(serverMessage.data);

        dispatch({ type: actionTypes.SERVER_MESSAGE_RECIEVED, message: msg });
      };
      socket.onopen = () => {
        dispatch({ type: actionTypes.OPEN });
      };
      socket.onclose = () => {
        dispatch({ type: actionTypes.CLOSED });
      };
      socket.onerror = (error) => {
        dispatch({ type: actionTypes.SOCKET_ERROR, error });
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
      console.error(error);
    }
  }

  return children;
}
