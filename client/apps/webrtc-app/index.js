import "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.2.0/fetch.js";
import { h, render } from "preact";
import htm from "htm.module";

const html = htm.bind(h);
render(
  html`<div>WebRTC app</div>`,

  document.body
);
