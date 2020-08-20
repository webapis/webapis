import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import { useEffect } from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import * as actions from "./actions";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
const html = htm.bind(h);
export default function NodeAuthService({ children, state, dispatch }) {
  const {
    signupStarted,
    loginStarted,
    changePasswordStared,
    requestPassChangeStarted,
  } = state;

  useEffect(() => {
    if (loginStarted) {
      actions.login({ dispatch, state });
    }
  }, [loginStarted]);

  useEffect(() => {
    if (signupStarted) {
      actions.signup({ dispatch, state });
    }
  }, [signupStarted]);

  useEffect(() => {
    if (changePasswordStared) {
      actions.changePassword({ dispatch, state });
    }
  }, [changePasswordStared]);

  useEffect(() => {
    if (requestPassChangeStarted) {
      actions.forgotPassword({ dispatch, state });
    }
  }, [requestPassChangeStarted]);
  return html`${children}`;
}
