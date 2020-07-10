import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { useHangouts } from "../../state/useHangouts";
import * as actions from "./actions";
import { actionTypes } from "../../state/actionTypes";
import { useUserName } from "features/authentication/state/useUserName";
export function WebSocketContainer(props) {
  const { username, token } = useUserName();
  const [socket, setSocket] = useState();

  const { children, socketUrl } = props;
  const { dispatch, state } = useHangouts();
  const { searchHangouts, search, pendingHangout } = state;

  useEffect(() => {
    if (username) {
      const sock = new WebSocket(`${socketUrl}/hangouts/?username=${username}`);
      sock.onmessage = (serverMessage) => {
        const msg = JSON.parse(serverMessage.data);

        dispatch({ type: actionTypes.SERVER_MESSAGE_RECIEVED, message: msg });
      };
      sock.onopen = () => {
        dispatch({ type: actionTypes.OPEN });
      };
      sock.onclose = () => {
        dispatch({ type: actionTypes.CLOSED });
      };
      sock.onerror = (error) => {
        dispatch({ type: actionTypes.SOCKET_ERROR, error });
      };
      dispatch({ type: actionTypes.SOCKET_READY, socket: sock });
      setSocket(sock);
    }
  }, [username]);

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

  function sendPendingHangout() {
    socket.send(JSON.stringify(pendingHangout));

    dispatch({ type: actionTypes.SENDING_HANGOUT_FULLFILLED });
  }

  return children;
}
