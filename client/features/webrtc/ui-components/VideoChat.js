import { h } from "preact";
import {
  useContext,
  useMemo,
  useReducer,
  useEffect,
  useState,
  useRef,
} from "preact/hooks";
import htm from "htm.module";

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
