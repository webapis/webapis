import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  lazy,
  Suspense,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/preact.combat.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { useAppRoute } from "../../components/app-route/index";
import AuthFeatureRoutes from "../../features/authentication/AuthFeatureRoutes";
const html = htm.bind(h);
export default function RouteContainer({ user }) {
  const {
    state: { appRoute },
  } = useAppRoute({ appRoute: "/auth", featureRoute: "/login" });
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
