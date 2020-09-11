import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import WebSocketClient from "../../client/features/websocket/demo-ui/WebSocketClient";

const html = htm.bind(h);
const messages = [
  { username: "demo", message: "hello bero" },
  { username: "bero", message: "hello demo" },
];
export default function WebSocketUiState({ stream }) {
  return html` <div style="height:100%">
    <h5>WebSocket Client ui</h5>
    <div class="row">
      <div class="col">
        <${WebSocketClient}
          message="my message"
          messages=${messages}
          connectionState="connected"
          username="demo"
        />
      </div>
      <div class="col">
        <${WebSocketClient}
          message="my message"
          messages=${messages}
          connectionState="connected"
          username="bero"
        />
      </div>

      <div></div>
    </div>
  </div>`;
}
