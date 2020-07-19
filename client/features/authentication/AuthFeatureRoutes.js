import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  Suspense,
  lazy,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/compat.module.js";
import { FeatureRoute } from "components/app-route";
import { useAuth } from "./state/useAuth";
const Login = lazy(() => import("./ui-components/Login"));
const ChangePassword = lazy(() => import("./ui-components/ChangePassword"));
const ForgotPassword = lazy(() => import("./ui-components/ForgotPassword"));
const Signup = lazy(() => import("./ui-components/Signup"));
const Profile = lazy(() => import("./ui-components/Profile"));

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
    state,
  } = useAuth();

  return [
    <FeatureRoute path="/change-pasword">
      <Suspense fallback={<div>loading...</div>}>
        <ChangePassword
          {...state}
          onFocus={onFocus}
          onBlur={onChangePassBlur}
          onChange={onChange}
          onPasswordChange={onPasswordChange}
        />
      </Suspense>
    </FeatureRoute>,
    <FeatureRoute path="/login">
      <Suspense fallback={<div>loading...</div>}>
        <Login
          {...state}
          onFocus={onFocus}
          onBlur={onLoginBlur}
          onChange={onChange}
          onLogin={onLogin}
        />
      </Suspense>
    </FeatureRoute>,
    <FeatureRoute path="/signup">
      <Suspense fallback={<div>loading...</div>}>
        <Signup
          {...state}
          onFocus={onFocus}
          onBlur={onSignupBlur}
          onChange={onChange}
          onSignup={onSignup}
        />
      </Suspense>
    </FeatureRoute>,
    <FeatureRoute path="/forgot-pasword">
      <Suspense fallback={<div>loading...</div>}>
        <ForgotPassword
          {...state}
          onFocus={onFocus}
          onBlur={onRequestPassChangeBlur}
          onChange={onChange}
          onRequestPasswordChange={onRequestPasswordChange}
        />
      </Suspense>
    </FeatureRoute>,
    <FeatureRoute path="/profile">
      <Suspense fallback={<div>loading...</div>}>
        <Profile />
      </Suspense>
    </FeatureRoute>,
  ];
}
