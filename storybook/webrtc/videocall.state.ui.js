import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import VideoCaller from "../../client/features/webrtc/ui-components/VideoCaller";
import VideoCallee from "../../client/features/webrtc/ui-components/VideoCallee";
import VideoChat from "../../client/features/webrtc/ui-components/VideoChat";
const html = htm.bind(h);

export default function VideoCallUiState({ stream }) {
  return html` <div style="height:100%">
    <h5>Ready to call</h5>
    <${VideoCaller}
      localStream=${stream}
      calling=${false}
      name="demouser"
      username="berouser"
    />
    <h5>Calling...</h5>
    <${VideoCaller}
      localStream=${stream}
      calling=${true}
      name="demouser"
      username="berouser"
    />
    <h5>Recieving a call</h5>
    <${VideoCallee}localStream =${stream} recievingCall=${true} />
    <h5>Video Chat</h5>
    <${VideoChat}localStream
      =${stream}
      remoteStream=${stream}
      recievingCall=${true}
    />
  </div>`;
}
