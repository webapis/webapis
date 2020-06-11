import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { actionTypes } from './actionTypes';

export function useWebSocket({ socketUrl, username, dispatch }) {
  useEffect(() => {
    if (username) {
      const sock = new WebSocket(`${socketUrl}/?username=${username}`);
      sock.onmessage = (message) => {
        const msg = JSON.parse(message.data);
        debugger;
        dispatch({ type: actionTypes.SOCKET_MESSAGE_RECIEVED, socketMessage: msg });
   
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
    }
  }, [username]);
}
