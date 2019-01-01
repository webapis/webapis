import {
  h,
  createContext,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useContext,
  useMemo,
  useReducer,
  useEffect,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import reducer, { initState } from "./reducer";
import { initWebSocket } from "./actions";
import actionTypes from "./actionTypes";
const html = htm.bind(h);

export const WebSocketContext = createContext();

export default function WebSocketProvider(props) {
  const { url, children } = props || {};

  const [state, dispatch] = useReducer(reducer, initState);
  const { websocket, message, connectionState } = state;
  useEffect(() => {
    if (url) {
      initWebSocket({ url, dispatch });
    }
  }, [url]);
  useEffect(() => {
    if (websocket) {
      websocket.onmessage = (message) => {
        const msg = JSON.parse(message.data);

        dispatch({ type: actionTypes.MESSAGE_RECIEVED, message: msg });
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

  return children({ sendMessage, message, connectionState });
}
