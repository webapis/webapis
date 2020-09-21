import "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.2.0/fetch.js";
import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import { useEffect } from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import WebSocketProvider from "../../features/websocket/WebSocketProvider";
import WebSocketClient from "./WebSocketClient";

const html = htm.bind(h);

export default function App() {
  return html`
    <div class="row">
      <${WebSocketProvider} url=${RTC_URL}
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
