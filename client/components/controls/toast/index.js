import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import userImage from "./user.png";
const html = htm.bind(h);
export default function Toast() {
  return html`
    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <img src="{userImage}" class="rounded mr-2" alt="..." />
        <strong class="mr-auto">Bootstrap</strong>
        <small class="text-muted">just now</small>
        <button
          type="button"
          class="ml-2 mb-1 close"
          data-dismiss="toast"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="toast-body">See? Just like this.</div>
    </div>
  `;
}
