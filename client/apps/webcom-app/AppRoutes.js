import { h } from "preact";
import { useEffect } from "preact/hooks";
import { Suspense, lazy } from "preact/compat";
import { AppRoute, useAppRoute } from "components/app-route";
import { Home } from "./Home";
import { AuthFatureRoutes, useAuth } from "features/authentication";

const HangoutsFeatureRoutes = lazy(() =>
  import("features/hangouts/HangoutsFeatureRoutes")
);

export function AppRoutes() {
  const { state } = useAuth();
  const { onAppRoute } = useAppRoute();
  useEffect(() => {
    if (state.user) {
      onAppRoute({ route: "/hangouts", featureRoute: "/filter" });
    } else {
      onAppRoute({ route: "/auth", featureRoute: "/login" });
    }
  }, [state]);
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
