import { h } from "preact";
import { Suspense, lazy } from "preact/compat";
import { AppRoute } from "components/app-route";
import { Home } from "./Home";
import { AuthFatureRoutes } from "features/authentication";

const Hangouts = lazy(() => import("features/hangouts/ui-components/Hangout"));

export function AppRoutes() {
  return (
    <div style={{ height: "100%" }}>
      <AppRoute path="/auth">
        <AuthFatureRoutes />
      </AppRoute>
      <AppRoute path="/">
        <Home />
      </AppRoute>

      <AppRoute path="/hangouts">
        <Suspense fallback={<div>loading...</div>}>
          <Hangouts />
        </Suspense>
      </AppRoute>
    </div>
  );
}
