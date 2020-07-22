import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  Suspense,
  lazy,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis/preact.combat.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { FeatureRoute } from "components/app-route/index";
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

  return html`
    <${FeatureRoute} path="/change-pasword">
      <${Suspense} fallback=${Loading}>
        <${ChangePassword}
          ...${state}
          onFocus=${onFocus}
          onBlur=${onChangePassBlur}
          onChange=${onChange}
          onPasswordChange=${onPasswordChange}
        />
      <//>
    <//>
    <${FeatureRoute} path="/login">
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
    <//>
    <${FeatureRoute} path="/signup">
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
    <//>
    <${FeatureRoute} path="/forgot-pasword">
      <${Suspense} fallback=${Loading}>
        <${ForgotPassword}
          ...${state}
          onFocus=${onFocus}
          onBlur=${onRequestPassChangeBlur}
          onChange=${onChange}
          onRequestPasswordChange=${onRequestPasswordChange}
        />
      <//>
    <//>
    <${FeatureRoute} path="/profile">
      <${Suspense} fallback=${Loading}>
        <${Profile} />
      <//>
    <//>
  `;
}

function Loading() {
  return html`<div>Loading...</div>`;
}
