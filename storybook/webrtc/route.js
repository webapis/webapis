import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
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
  return [
    html`
      <${AppRoute} path="/videocall">
        <${VideoCallUiState} />
      <//>
    `,
  ];
}
