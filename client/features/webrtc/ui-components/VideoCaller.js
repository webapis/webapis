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

export default function VideoCaller({
  username,
  onClick,
  localStream,
  calling = false,
}) {
  const [stream, setStream] = useState(null);
  const localVideoRef = useRef(null);

  useEffect(() => {
    if (localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return html`<div>
    <div>
      <video width="100" autoplay ref=${localVideoRef}></video>

      <button
        id="videocall"
        onClick=${onClick}
        disabled=${calling}
        class="btn btn-outline-success"
        data-testid="videocall-btn"
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
          onClick=${onClick}
          class="btn btn-outline-danger"
          data-testid="close-videocall-btn"
        >
          Close
        </button>
      `}
      ${calling &&
      html`
        <button
          id="cancel-videocall"
          onClick=${onClick}
          class="btn btn-outline-danger"
          data-testid="cancel-videocall-btn"
        >
          Cancel
        </button>
      `}
    </div>
  </div>`;
}
