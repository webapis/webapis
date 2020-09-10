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
  username,
  onVideoCall,
  onCancelVideoCall,
  onCloseVideoCall,
  remoteStream,
  calling = false,
}) {
  const [stream, setStream] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((mediaStream) => {
        setStream(mediaStream);
      });
  }, []);
  useEffect(() => {
    if (stream) {
      localVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return html`<div>
    <div>
      <video width="100" autoplay ref=${localVideoRef}></video>
      <video width="200" autoplay ref=${remoteVideoRef}></video>

      <button
        id="videocall"
        onClick=${onVideoCall}
        disabled=${calling}
        class="btn btn-outline-success"
        data-testid="call-btn"
      >
        ${calling &&
        html`
          <span
            class="spinner-grow spinner-grow-sm mr-1"
            role="status"
            aria-hidden="true"
          ></span>
        `}
        ${calling ? "Calling..." : "Call"}
      </button>
      ${!calling &&
      html`
        <button
          id="close-videocall"
          onClick=${onCloseVideoCall}
          class="btn btn-outline-danger"
          data-testid="close-call-btn"
        >
          Close
        </button>
      `}
      ${calling &&
      html`
        <button
          id="cancel-videocall"
          onClick=${onCancelVideoCall}
          class="btn btn-outline-danger"
          data-testid="cancel-call-btn"
        >
          Cancel
        </button>
      `}
    </div>
  </div>`;
}
