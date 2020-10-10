import { h, createContext } from "preact";
import { useContext, useMemo, useReducer, useEffect } from "preact/hooks";
import htm from "htm.module";
const html = htm.bind(h);
import { WebSocketContext } from "./WebSocketProvider";
export default function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useHangoutContext must be used with HangoutsProvider");
  }

  const [state, dispatch] = context;
  const { websocket, message, connectionState } = state;
  function sendMessage(msg) {
    websocket.send(JSON.stringify(msg));
  }

  return { message, connectionState, sendMessage };
}
