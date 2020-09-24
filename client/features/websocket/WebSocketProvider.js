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
  const { children, closeConnection, socketUrl } = props || {};
  const [state, dispatch] = useReducer(reducer, initState);
  const { websocket, message, connectionState } = state;

  useEffect(() => {
    if (closeConnection) {
      websocket.close();
    } else {
    }
  }, [closeConnection]);

  useEffect(() => {
    if (socketUrl) {
      debugger;
      initWebSocket({ url: socketUrl, dispatch });
    }
  }, [socketUrl]);
  useEffect(() => {
    if (websocket) {
      websocket.onmessage = (message) => {
        const msg = JSON.parse(message.data);

        dispatch({ type: actionTypes.MESSAGE_RECIEVED, message: msg });
      };
      websocket.onopen = () => {
        debugger;
        dispatch({
          type: actionTypes.CONNECTION_STATE_CHANGED,
          connectionState: "open",
        });
      };
      websocket.onclose = () => {
        debugger;
        dispatch({
          type: actionTypes.CONNECTION_STATE_CHANGED,
          connectionState: "close",
        });
      };
      websocket.onerror = (error) => {
        debugger;
        dispatch({ type: actionTypes.SOCKET_ERROR, error });
      };
    }
  }, [websocket]);

  function sendMessage({ data, type }) {
    debugger;
    websocket.send(JSON.stringify({ data, type }));
  }
  function setRtcUrl(url) {
    dispatch({ type: actionTypes.URL_CHANGED, url });
  }
  return children({ sendMessage, message, connectionState, setRtcUrl });
}
