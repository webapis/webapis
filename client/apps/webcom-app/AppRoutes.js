import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";

import {
  Suspense,
  lazy,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/preact.combat.cdn.js";

import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { AppRoute, useAppRoute } from "components/app-route/index";

const AuthFeatureRoutes = lazy(() =>
  import("features/authentication/AuthFeatureRoutes")
);
const html = htm.bind(h);
const HangoutsFeatureRoutes = lazy(() =>
  import("features/hangouts/HangoutsFeatureRoutes")
);
const ErrorPage = lazy(() => import("./ErrorPage"));
const AppMonitor = lazy(() => import("features/app-monitor/index"));
export function AppRoutes() {
  const { routeState } = useAppRoute();

  const { route } = routeState;

  switch (route) {
    case "/auth":
      return html`<div style=${{ height: "85vh" }}>
        <${AppRoute} path=${"/auth"}>
          <${Suspense} fallback=${Loading}>
            <${AuthFeatureRoutes} />
          <//>
        <//>
      </div>`;
    case "/hangouts":
      return html` <${AppRoute} path=${"/hangouts"}>
        <${Suspense} fallback=${Loading}>
          <${HangoutsFeatureRoutes} />
        <//>
      <//>`;
    case "/error":
      return html` <${AppRoute}path =${"/error"}>
        <${Suspense} fallback=${Loading}>
          <${ErrorPage} />
        <//>
      <//>`;

    case "/monitor":
      return html`
        <${AppRoute} path=${"/monitor"}>
          <${Suspense} fallback=${Loading}>
            <${AppMonitor}//>
          <//>
        <//>
      `;
    default:
      return null;
  }
}

function Loading() {
  return html`<div>Loading...</div>`;
}
