import { h } from "preact";
import { useEffect } from "preact/hooks";
import { Suspense, lazy } from "preact/compat";
import { AppRoute, useAppRoute } from "components/app-route";
import { Home } from "./Home";
import { AuthFatureRoutes, useAuth } from "features/authentication";

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
      <AppRoute path="/error">
        <Suspense fallback={<div>loading...</div>}>
          <ErrorPage />
        </Suspense>
      </AppRoute>
    </div>
  );
}
