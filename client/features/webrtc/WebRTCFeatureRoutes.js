import { h } from "preact";
import { lazy, Suspense } from "compat.module";
import htm from "htm.module";
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
