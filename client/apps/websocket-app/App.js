import "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.2.0/fetch.js";
import { h } from "preact";
import { useEffect } from "preact/hooks";
import htm from "htm.module";
import WebSocketProvider from "../../features/websocket/WebSocketProvider";
import WebSocketClient from "./WebSocketClient";

const html = htm.bind(h);
const start = "true";
export default function App() {
  return html`
    <div class="row">
      <${WebSocketProvider}
        socketUrl=${`wss://localhost:${PORT}/unauthed-msg/websocket-app`}
        >${({ sendMessage, message, connectionState }) => {
          return html`
            <div class="col" data-testid="beroclient">
              <${WebSocketClient}
                username="berouser"
                sendMessage=${sendMessage}
                message=${message}
                connectionState=${connectionState}
              />
            </div>
            <div class="col" data-testid="democlient">
              <${WebSocketClient}
                username="demouser"
                sendMessage=${sendMessage}
                message=${message}
                connectionState=${connectionState}
              />
            </div>
          `;
        }}<//
      >
    </div>
  `;
}
