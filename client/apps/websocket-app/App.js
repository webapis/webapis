import "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.2.0/fetch.js";
import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import { useEffect } from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";

import WebSocketProviderBero from "./WebSocketProviderBero";
import WebSocketProviderDemo from "./WebSocketProviderDemo";
import WebSocketClientBero from "./WebSocketClientBero";
import WebSocketClientDemo from "./WebSocketClientDemo";
const html = htm.bind(h);

export default function App() {
  return html`
    <div class="row">
      <div class="col">
        <${WebSocketProviderBero}>
          <${WebSocketClientBero} username="bero" />
        <//>
      </div>
      <div class="col">
        <${WebSocketProviderDemo}>
          <${WebSocketClientDemo} username="demo" />
        <//>
      </div>
    </div>
  `;
}
