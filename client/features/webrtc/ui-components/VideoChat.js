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

export default function VideoChat({
  username,
  onClick,
  localStream,
  remoteStream,
}) {
  const [stream, setStream] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

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
        id="end-videocall"
        onClick=${onClick}
        class="btn btn-outline-danger"
        data-testid="end-videocall-btn"
      >
        End
      </button>
    </div>
  </div>`;
}
