import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";

import {
  Suspense,
  lazy,
} from "https://gitcdn.xyz/cdn/webapis/webapis/3ee095aa65a1f8f9cf98a6b6f55d5080c9d0acb6/preact.combat.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { AppRoute } from "components/app-route/index";
import { Home } from "./Home";

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
  return html`
    <div style=${{ height: "85vh" }}>
      <${AppRoute} path=${"/auth"}>
        <${Suspense} fallback=${Loading}>
          <${AuthFeatureRoutes} />
        <//>
      <//>
      <${AppRoute}path =${"/"}>
        <${Home} />
      <//>
      <${AppRoute} path=${"/hangouts"}>
        <${Suspense} fallback=${Loading}>
          <${HangoutsFeatureRoutes} />
        <//>
      <//>
      <${AppRoute}path =${"/error"}>
        <${Suspense} fallback=${Loading}>
          <${ErrorPage} />
        <//>
      <//>
      <${AppRoute} path=${"/monitor"}>
        <${Suspense} fallback=${Loading}>
          <${AppMonitor}//>
        <//>
      <//>
    </div>
  `;
}

function Loading() {
  return html`<div>Loading...</div>`;
}
