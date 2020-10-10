import { h } from "preact";
import { lazy, Suspense } from "compat.module";
import { useEffect } from "preact/hooks";
import htm from "htm.module";
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
