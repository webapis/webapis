/* eslint-disable no-undef */
import { h } from "preact";
import AppRouteProvider from "components/app-route";
export default function AppProviders({ children }) {
  return (
    <AppRouteProvider
      //
      title="Webcom"
      initState={{ route: "/", featureRoute: "/hangouts", name: "storybook" }}
    >
      {children}
    </AppRouteProvider>
  );
}
