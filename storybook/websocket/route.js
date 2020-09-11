import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";

import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { AppRoute } from "../../client/components/app-route/index";

import WebSocketClientUIState from "./websocket.ui.state";
const html = htm.bind(h);

export default function WebSocketUIRoutes() {
  return [
    html`
      <${AppRoute} path="/websocket">
        <${WebSocketClientUIState} />
      <//>
    `,
  ];
}
