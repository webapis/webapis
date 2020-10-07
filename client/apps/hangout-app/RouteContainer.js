import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  lazy,
  Suspense,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/preact.combat.cdn.js";
import { useEffect } from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { useAppRoute } from "../../components/app-route/index";
import HangoutFeatureRoutes from "../../features/hangouts/HangoutsFeatureRoutes";
const html = htm.bind(h);
export default function RouteContainer({ user }) {
  const {
    state: { appRoute },
    onAppRoute,
  } = useAppRoute();

  switch (appRoute) {
    case "/":
      return html` <${Suspense} fallback=${Loading}>
        <${HangoutFeatureRoutes} user=${user} appRoute="/" />
      <//>`;
  }
}

function Loading() {
  return html` <div data-testid="loading">Loading</div>`;
}
