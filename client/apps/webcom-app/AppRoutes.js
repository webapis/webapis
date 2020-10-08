import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";

import {
  Suspense,
  lazy,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/preact.combat.cdn.js";
import { useEffect } from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { useAppRoute } from "components/app-route/index";
import { loadBrowserId } from "../../features/authentication/state/AuthProvider";
import { useAuth } from "../../features/authentication/state/useAuth";
const AuthFeatureRoutes = lazy(() =>
  import("features/authentication/AuthFeatureRoutes")
);
const html = htm.bind(h);
const HangoutsFeatureRoutes = lazy(() =>
  import("features/hangouts/HangoutsFeatureRoutes")
);
const ErrorPage = lazy(() => import("./ErrorPage"));
const AppMonitor = lazy(() => import("features/app-monitor/index"));
export function AppRoutes(props) {
  const {
    state: { user },
  } = useAuth();
  const { setRtcUrl, connectionState } = props;
  const {
    state: { appRoute },
    onAppRoute,
  } = useAppRoute();

  useEffect(() => {
    const browserId = loadBrowserId();

    if (user) {
      if (ENV === "production") {
        setRtcUrl(
          `${location.origin.replace(
            /^http/,
            "ws"
          )}/authed-msg/hangouts/webcom-app/?username=${
            user.username
          }&browserId=${browserId}`
        );
      } else {
        setRtcUrl(
          `wss://localhost:${PORT}/authed-msg/hangouts/webcom-app/?username=${user.username}&browserId=${browserId}`
        );
      }

      // onAppRoute({ appRoute: "/hangouts", featureRoute: "/hangout" });
    } else {
      // onAppRoute({ appRoute: "/auth", featureRoute: "/login" });
    }
  }, [user, connectionState]);
  switch (appRoute) {
    case "/auth":
      return html`<div style=${{ height: "90vh" }}>
        <${Suspense} fallback=${Loading}>
          <${AuthFeatureRoutes} />
        <//>
      </div>`;
    case "/hangout":
    case "/":
      return html` <${Suspense} fallback=${Loading}>
        <div style=${{ height: "70vh" }}>
          <${HangoutsFeatureRoutes} user=${user && user} appRoute=${"/"} />
        </div>
      <//>`;
    case "/error":
      return html` <${Suspense} fallback=${Loading}>
        <${ErrorPage} />
      <//>`;

    default:
      return html` <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>`;
  }
}

function Loading() {
  return html`<div>Loading...</div>`;
}
