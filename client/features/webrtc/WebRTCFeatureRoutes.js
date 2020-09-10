import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  lazy,
  Suspense,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/preact.combat.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { useAppRoute } from "components/app-route/index";
import useWebRTC from "../webrtc/state/useWebRTC";

const VideoCaller = lazy(() => import("./ui-components/VideoCaller"));
const VideoCallee = lazy(() => import("./ui-components/VideoCallee"));
const VideoChat = lazy(() => import("./ui-components/VideoChat"));
const html = htm.bind(h);
export default function HangoutsFeatureRoutes(props) {
  const { onAppRoute, routeState } = useAppRoute();
  const { featureRoute } = routeState;
  const { onClick, state: webrtcState } = useWebRTC({
    target: hangout && hangout.username,
  });
  switch (featureRoute) {
    case "/videocaller":
      return html`<${Suspense} fallback=${Loading}>
        <${VideoCaller}
          hangout=${hangout}
          ...${webrtcState}
          onClick=${onClick}
        />
      <//>`;
    case "/videocallee":
      return html`<${Suspense} fallback=${Loading}>
        <${VideoCallee}
          hangout=${hangout}
          ...${webrtcState}
          onClick=${onClick}
        />
      <//>`;
    case "/videochat":
      return html`<${Suspense} fallback=${Loading}>
        <${VideoChat} hangout=${hangout} ...${webrtcState} onClick=${onClick} />
      <//>`;
    default:
      return null;
  }
}

function Loading() {
  return html` <div data-testid="loading">Loading</div>`;
}
