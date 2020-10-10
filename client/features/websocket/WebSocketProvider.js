import { h, createContext } from "preact";
import { useContext, useMemo, useReducer, useEffect } from "preact/hooks";
import htm from "htm.module";
import reducer, { initState } from "./reducer";
import { initWebSocket } from "./actions";
import actionTypes from "./actionTypes";
const html = htm.bind(h);

export const WebSocketContext = createContext();

export default function WebSocketProvider(props) {
  const { children, closeConnection, socketUrl } = props || {};
  const [state, dispatch] = useReducer(reducer, initState);
  const { websocket, message, connectionState, url } = state;

  useEffect(() => {
    if (closeConnection) {
      websocket.close();
    } else {
    }
  }, [closeConnection]);

  useEffect(() => {
    if (socketUrl) {
      initWebSocket({ url: socketUrl, dispatch });
    }
  }, [socketUrl]);
  useEffect(() => {
    if (url && !websocket) {
      initWebSocket({ url, dispatch });
    }
  }, [url, websocket]);
  useEffect(() => {
    if (websocket) {
      websocket.onmessage = (message) => {
        if (!message.data.includes("heartbeat")) {
          const msg = JSON.parse(message.data);

          dispatch({ type: actionTypes.MESSAGE_RECIEVED, message: msg });
        } else {
          websocket.send("heartbeat");
        }
      };
      websocket.onopen = () => {
        dispatch({
          type: actionTypes.CONNECTION_STATE_CHANGED,
          connectionState: "open",
        });
      };
      websocket.onclose = () => {
        dispatch({
          type: actionTypes.CONNECTION_STATE_CHANGED,
          connectionState: "close",
        });
      };
      websocket.onerror = (error) => {
        dispatch({ type: actionTypes.SOCKET_ERROR, error });
      };
    }
  }, [websocket]);

  function sendMessage({ data, type }) {
    websocket.send(JSON.stringify({ data, type }));
  }
  function setRtcUrl(url) {
    dispatch({ type: actionTypes.URL_CHANGED, url });
  }
  return children({ sendMessage, message, connectionState, setRtcUrl });
}
