import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import GuestHangchat from "../../client/features/hangouts/ui-components/GuestHangchat";
const html = htm.bind(h);
export default function GuestHanchatUiState() {
  return html`
    <div style="height:100%">
      <${GuestHangchat} name="demouser" username="berouser" />
    </div>
  `;
}
