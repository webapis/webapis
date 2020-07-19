import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import { AppRoute } from "components/app-route";
import LoginStates from "./states/login.states";
import SignUpStates from "./states/signup.states";
import ChangePasswordStates from "./states/change-password.states";
import ForgotPasswordStates from "./states/forgot-password.states";
export default function AuthDemoRoutes() {
  return [
    <AppRoute path="/login">
      <LoginStates />
    </AppRoute>,
    <AppRoute path="/signup">
      <SignUpStates />
    </AppRoute>,
    <AppRoute path="/change-password">
      <ChangePasswordStates />
    </AppRoute>,
    <AppRoute path="/forgot-password">
      <ForgotPasswordStates />
    </AppRoute>,
  ];
}
