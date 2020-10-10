import { h } from "preact";
import { lazy, Suspense } from "compat.module";
import { useEffect } from "preact/hooks";
import htm from "htm.module";
import { useAppRoute } from "../../components/app-route/index";
import AuthFeatureRoutes from "../../features/authentication/AuthFeatureRoutes";
import { useAuth } from "../../features/authentication/state/useAuth";
const html = htm.bind(h);
export default function RouteContainer() {
  const {
    state: { appRoute },
    onAppRoute,
  } = useAppRoute();
  const {
    state: { user },
  } = useAuth();

  switch (appRoute) {
    case "/auth":
      return html`<div style="height:70vh">
        <${Suspense} fallback=${Loading}>
          <${AuthFeatureRoutes} user=${user} />
        <//>
      </div>`;
    case "/home":
      return html`<div style="height:70vh">
        <${Suspense} fallback=${Loading}>
          <div>Home</div>
        <//>
      </div>`;
  }
}

function Loading() {
  return html` <div data-testid="loading">Loading</div>`;
}
