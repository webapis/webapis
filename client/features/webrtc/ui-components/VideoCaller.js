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
