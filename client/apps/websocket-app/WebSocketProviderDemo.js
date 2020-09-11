import "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.2.0/fetch.js";
import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import { useEffect } from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import useWebSocket from "../../features/websocket/useWebSocket";
import WebSocketProvider from "../../features/websocket/WebSocketProvider";
const html = htm.bind(h);

export default function WebSocketProviderDemo({ children }) {
  return html`<${WebSocketProvider} url="wss://localhost:3000/testwebsocket"
    >${children}<//
  > `;
}
