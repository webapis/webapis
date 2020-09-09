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
import Layout from "./Layout";
const html = htm.bind(h);

export default function VideoCall({ username }) {
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((mediaStream) => {
        setStream(mediaStream);
      });
  }, []);
  useEffect(() => {
    if (stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  return html`<div>
    <${Layout} username=${username} desc="You are about to call ">
      <div>
        <video width="100" autoplay ref=${videoRef}></video>

        <button class="btn btn-outline-success" data-testid="call-btn">
          <span
            class="spinner-grow spinner-grow-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Calling...
        </button>
        <button class="btn btn-outline-danger" data-testid="close-call-btn">
          Close
        </button>
      </div>
    <//>
  </div>`;
}
