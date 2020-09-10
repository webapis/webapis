import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useContext,
  useMemo,
  useReducer,
  useEffect,
  useState,
  useRef,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";

const html = htm.bind(h);

export default function VideoCallee({
  localStream,
  username,
  onClick,
  recievingCall = false,
}) {
  const [stream, setStream] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return html`<div>
    <div>
      <video width="100" autoplay ref=${localVideoRef}></video>
      <video width="200" autoplay ref=${remoteVideoRef}></video>
      ${recievingCall &&
      html`<div class="spinner-grow text-success" role="status">
        <span class="sr-only">Loading...</span>
      </div>`}
      <button
        id="answer-video-call"
        class="btn btn-outline-success"
        data-testid="answer-videocall-btn"
        onClick=${onClick}
      >
        Answer
      </button>
      <button
        id="decline-video-call"
        data-testid="decline-videocall-btn"
        class="btn btn-outline-danger"
        onClick=${onClick}
      >
        Decline
      </button>
    </div>
  </div>`;
}
