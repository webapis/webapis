import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { AppRoute } from "../../client/components/app-route/index";

import LoginStates from "./states/login.states";
import SignUpStates from "./states/signup.states";
import ChangePasswordStates from "./states/change-password.states";
import ForgotPasswordStates from "./states/forgot-password.states";

const html = htm.bind(h);

export default function AuthDemoRoutes() {
  return [
    html`
      <${AppRoute} path="/login">
        <${LoginStates} />
      <//>
      <${AppRoute} path="/signup"> <${SignUpStates} /> <//>
      <${AppRoute} path="/change-password"> <${ChangePasswordStates} /> <//>
      <${AppRoute} path="/forgot-password"> <${ForgotPasswordStates} /> <//>
    `,
  ];
}
