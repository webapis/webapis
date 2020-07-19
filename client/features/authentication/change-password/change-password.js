import "whatwg-fetch";
import {
  h,
  render,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import ChangePassword from "../ui-components/ChangePassword";
import AuthProvider from "features/authentication";

import AppRouteProvider, { AppRoute } from "components/app-route";
import ThemeProvider from "components/theme/theme-context";
import AuthFeedback, { LoginLink } from "../ui-components/AuthFeedback";
render(
  <div>
    <AuthProvider>
      <ThemeProvider
        initState={{
          primary: {
            background: "#6200EE",
            color: "#ffffff",
            fontFamily: 'Roboto, Helvetica, "Arial"',
          },
        }}
      >
        <AppRouteProvider initState={{ route: "/", featureRoute: "/" }}>
          <AppRoute path="/">
            <ChangePassword />
          </AppRoute>
          <AppRoute path="/authfeedback">
            <AuthFeedback>
              <LoginLink />
            </AuthFeedback>
          </AppRoute>
        </AppRouteProvider>
      </ThemeProvider>
    </AuthProvider>
  </div>,
  document.body
);
