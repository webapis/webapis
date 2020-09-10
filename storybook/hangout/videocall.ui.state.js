import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import VideoCall from "../../client/features/hangouts/ui-components/VideoCall";
const html = htm.bind(h);

export default function VideoCallUiState() {
  return html` <div style="height:100%">
    <h5>Ready to call</h5>
    <${VideoCall} calling=${false} name="demouser" username="berouser" />
    <h5>Calling...</h5>
    <${VideoCall} calling=${true} name="demouser" username="berouser" />
  </div>`;
}
