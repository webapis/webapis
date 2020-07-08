import { h } from "preact";
import { Suspense, lazy } from "preact/compat";
import { AppRoute } from "components/app-route";
import { Home } from "./Home";
import { AuthFatureRoutes } from "features/authentication";

const HangoutsFeatureRoutes = lazy(() =>
  import("features/hangouts/HangoutsFeatureRoutes")
);

export function AppRoutes() {
  return (
    <div style={{ height: "85vh" }}>
      <AppRoute path="/auth">
        <AuthFatureRoutes />
      </AppRoute>
      <AppRoute path="/">
        <Home />
      </AppRoute>

      <AppRoute path="/hangouts">
        <Suspense fallback={<div>loading...</div>}>
          <HangoutsFeatureRoutes />
        </Suspense>
      </AppRoute>
    </div>
  );
}
