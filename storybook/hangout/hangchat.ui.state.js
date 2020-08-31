import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import Messages, {
  Message,
} from "../../client/features/hangouts/ui-components/Messages";
const html = htm.bind(h);

export default function HangchatUiState() {
  return html` <div style="height:100%">
    <h5 class="bg-success text-white text-center">Messages</h5>
    <${Messages}>
      <${Message}
        float="right"
        text="Hello demo How are you doing today? Are you doing all right"
      />
      <${Message}
        float="left"
        text="Hello bero. I am allright. What about you. Are you ok?"
      />
    <//>
  </div>`;
}
