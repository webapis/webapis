import "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.2.0/fetch.js";
import {
  h,
  render,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
//import AppProviders from "./AppProviders";
//import App from "./App";
const html = htm.bind(h);
render(
  html`
    <div>
      WebSocket app
    </div>
  `,

  document.body
);
