/* eslint-disable no-undef */
import { h } from "preact";
import AppRouteProvider from "components/app-route";
import HangoutAdapter from "features/hangouts/state/HangoutAdapter";
import HangoutsProvider from "features/hangouts/state/HangoutsProvider";
import AuthProvider from "features/authentication";
export function AppProviders({ children }) {
  return (
    <AppRouteProvider
      title="Webcom"
      initState={{ route: "/", featureRoute: "/hangouts" }}
    >
      <AuthProvider>
        <HangoutsProvider>
          <HangoutAdapter socketUrl={`wss://${ip}:3000`}>
            {children}
          </HangoutAdapter>
        </HangoutsProvider>
      </AuthProvider>
    </AppRouteProvider>
  );
}
