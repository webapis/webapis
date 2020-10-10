import "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.2.0/fetch.js";
import { h, render } from "preact";
import htm from "htm.module";

import App from "./App";
const html = htm.bind(h);
render(
  html`
    <div>
      WebSocket app
      <${App} />
    </div>
  `,

  document.body
);
