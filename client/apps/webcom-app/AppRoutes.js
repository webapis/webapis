import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import { useEffect } from "https://cdn.jsdelivr.net/gh/webapis/webapis@cbdf6161bd8ca09a385d62c8c697bd1cd87bb184/hooks.cdn.js";
import {
  Suspense,
  lazy,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/compat.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { AppRoute, useAppRoute } from "components/app-route/index";
import { Home } from "./Home";
import { AuthFatureRoutes, useAuth } from "features/authentication/index";
const html = htm.bind(h);
const HangoutsFeatureRoutes = lazy(() =>
  import("features/hangouts/HangoutsFeatureRoutes")
);
const ErrorPage = lazy(() => import("./ErrorPage"));
export function AppRoutes() {
  const { state } = useAuth();
  const { onAppRoute } = useAppRoute();
  useEffect(() => {
    if (state.user) {
      //  onAppRoute({ route: "/hangouts", featureRoute: "/filter" });
    } else {
      // onAppRoute({ route: "/auth", featureRoute: "/" });
    }
  }, [state]);
  return html`
    <div style=${{ height: "85vh" }}>
      <${AppRoute}path ="/auth">
        <${AuthFatureRoutes} />
      <//>
      <${AppRoute}path ="/">
        <${Home} />
      <//>
      <${AppRoute}path ="/hangouts">
        <${Suspense} fallback=${Loading}>
          <${HangoutsFeatureRoutes} />
        <//>
      <//>
      <${AppRoute}path ="/error">
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
