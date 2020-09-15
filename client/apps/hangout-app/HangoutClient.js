import {
  h,
  createContext,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useContext,
  useMemo,
  useReducer,
  useEffect,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import HangoutFeatureRoutes from "../../features/hangouts/HangoutsFeatureRoutes";
import Navigation from "../../features/hangouts/ui-components/Navigation";
import AppRouteProvider from "../../components/app-route/index";
import HangoutProvider from "../../features/hangouts/state/HangoutsProvider";
const html = htm.bind(h);

export default function HangoutClient({
  authState,
  sendMessage,
  message,
  connectionState,
  target,
}) {
  const { user } = authState;
  return html`<div>
    <${AppRouteProvider}
      title="Hangout"
      initState=${{ route: "/hangout", featureRoute: "/hangouts" }}
    >
      <${HangoutProvider}
        authState=${authState}
        sendMessage=${sendMessage}
        message=${message}
        connectionState=${connectionState}
      >
        <${Navigation}
          socketConnected=${true}
          authed=${true}
          messageCounter=${0}
          target=${target}
          username=${user.username}
          onAuthNavigation=${() => {}}
          onHangoutNavigation=${() => {}}
        />
        <${HangoutFeatureRoutes} user=${user} />
      <//>
    <//>
  </div>`;
}
