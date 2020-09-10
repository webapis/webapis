import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useEffect,
  useState,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { AppRoute } from "../../client/components/app-route/index";

import VideoCallUiState from "./videocall.state.ui";
const html = htm.bind(h);
const hangouts = [
  { username: "userone" },
  { username: "usertwo" },
  { username: "userthree" },
];

export default function WebRTCRoutes() {
  const [stream, setStream] = useState(null);
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((mediaStream) => {
        setStream(mediaStream);
      });
  }, []);
  return [
    html`
      <${AppRoute} path="/videocall">
        <${VideoCallUiState} stream=${stream} />
      <//>
    `,
  ];
}
