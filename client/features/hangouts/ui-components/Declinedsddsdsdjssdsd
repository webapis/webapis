import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { Done } from "icons/Done";
import Layout from "./Layout";
const html = htm.bind(h);

export default function Declined({ username, email }) {
  return html`
    <${Layout}
      id="declined-ui"
      username=${username}
      desc="You declined invitation from "
    >
      <div
        class="d-flex h-100 flex-column align-items-center justify-content-center"
      >
        <${Done} width="70" height="70" color="red" />

        <div>
          Invitation from ${" "}<b>${email}</b>${" "}declined successfully.
        </div>
      </div>
    <//>
  `;
}
