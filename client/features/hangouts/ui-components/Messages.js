import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";

import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
const html = htm.bind(h);
export default function Messages({ children }) {
  return html` <div class="container-fluid">
    <div class="row justify-content-center bg-success">
      <div class="col-sm-5 bg-light">
        ${children}
      </div>
    </div>
  </div>`;
}

export function Message({ float, text }) {
  if (float === "right")
    return html`<div class="row justify-content-end">
      <div class="float-right">timestamp</div>
      <div class="float-right bg-info" style="max-width:70%;">
        Message Right.${text}
      </div>
    </div>`;
  return html`<div class="row justify-content-start">
    <div class="float-left bg-warning " style="max-width:70%;">
      Message Left.${text}
    </div>
    <div class="float-left">timestamp</div>
  </div>`;
}

export function BlockerMessage() {
  return html` <div>Blocker Message</div>`;
}

export function BlockedMessage() {
  return html` <div>Blocked Message</div>`;
}
