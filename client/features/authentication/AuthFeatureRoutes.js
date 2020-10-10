import { h } from "preact";
import { Suspense, lazy } from "compat.module";
import htm from "htm.module";
import { useAppRoute } from "components/app-route/index";
import { useAuth } from "./state/useAuth";
const Login = lazy(() => import("./ui-components/Login"));
const ChangePassword = lazy(() => import("./ui-components/ChangePassword"));
const ForgotPassword = lazy(() => import("./ui-components/ForgotPassword"));
const Signup = lazy(() => import("./ui-components/Signup"));
const Profile = lazy(() => import("./ui-components/Profile"));
const html = htm.bind(h);
export default function AuthFeatureRoutes() {
  const {
    onFocus,
    onLogin,
    onLoginBlur,
    onSignupBlur,
    onChangePassBlur,
    onRequestPassChangeBlur,
    onSignup,
    onRequestPasswordChange,
    onPasswordChange,
    onChange,
    onAuthNavigation,
    state,
  } = useAuth();
  const {
    onAppRoute,
    state: { featureRoute },
  } = useAppRoute();
  switch (featureRoute) {
    case "/change-pasword":
      return html`
        <${Suspense} fallback=${Loading}>
          <${ChangePassword}
            ...${state}
            onFocus=${onFocus}
            onBlur=${onChangePassBlur}
            onChange=${onChange}
            onPasswordChange=${onPasswordChange}
          />
        <//>
      `;
    case "/login":
      return html`
        <${Suspense} fallback=${Loading}>
          <${Login}
            ...${state}
            onFocus=${onFocus}
            onBlur=${onLoginBlur}
            onChange=${onChange}
            onLogin=${onLogin}
            onAuthNavigation=${onAuthNavigation}
          />
        <//>
      `;
    case "/signup":
      return html`
        <${Suspense} fallback=${Loading}>
          <${Signup}
            ...${state}
            onFocus=${onFocus}
            onBlur=${onSignupBlur}
            onChange=${onChange}
            onSignup=${onSignup}
            onAuthNavigation=${onAuthNavigation}
          />
        <//>
      `;
    case "/forgot-pasword":
      return html`
        <${Suspense} fallback=${Loading}>
          <${ForgotPassword}
            ...${state}
            onFocus=${onFocus}
            onBlur=${onRequestPassChangeBlur}
            onChange=${onChange}
            onRequestPasswordChange=${onRequestPasswordChange}
          />
        <//>
      `;

    case "/profile":
      return html`
        <${Suspense} fallback=${Loading}>
          <${Profile} />
        <//>
      `;

    default:
      return html` <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>`;
  }
}

function Loading() {
  return html`<div>Loading...</div>`;
}
