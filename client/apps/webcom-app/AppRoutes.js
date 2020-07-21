import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";

import {
  Suspense,
  lazy,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis/preact.combat.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { AppRoute } from "components/app-route/index";
import { Home } from "./Home";
import { AuthFeatureRoutes } from "features/authentication/index";
const html = htm.bind(h);
// const HangoutsFeatureRoutes = lazy(() =>
//   import("features/hangouts/HangoutsFeatureRoutes")
// );
const ErrorPage = lazy(() => import("./ErrorPage"));
export function AppRoutes() {
  return html`
    <div style=${{ height: "85vh" }}>
      <${AppRoute} path=${"/auth"}> <${AuthFeatureRoutes} /> <//>
      <${AppRoute}path =${"/"}>
        <${Home} />
      <//>

      <${AppRoute}path =${"/error"}>
        <${Suspense} fallback=${Loading}>
          <${ErrorPage} />
        <//>
      <//>
    </div>
  `;
}

function Loading() {
  return html`<div>Loading...</div>`;
}
