import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useEffect,
  useState,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import WebSocketProvider from "../../features/websocket/WebSocketProvider";
import WebSocketClient from "./WebSocketClient";
const html = htm.bind(h);
export default function WebSocketClientBero({ username }) {
  return html`<${WebSocketProvider}
    url=${`wss://localhost:${PORT}/unauthed-msg/?username=berouser`}
    >${({ sendMessage, message, connectionState }) => {
      return html`
        <${WebSocketClient}
          username=${username}
          connectionState=${connectionState}
          message=${message}
          sendMessage=${sendMessage}
          target="demouser"
        />
      `;
    }}<//
  >`;
}
