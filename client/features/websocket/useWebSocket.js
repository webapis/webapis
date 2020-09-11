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
const html = htm.bind(h);
import { WebSocketContext } from "./WebSocketProvider";
export default function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useHangoutContext must be used with HangoutsProvider");
  }

  const [state, dispatch] = context;
  const { websocket } = state;
  function sendMessage(msg) {
    websocket.send(JSON.stringify(msg));
  }

  return { state, dispatch, sendMessage };
}
