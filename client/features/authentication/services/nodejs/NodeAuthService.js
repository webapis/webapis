import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import { useEffect } from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import * as actions from "./actions";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
const html = htm.bind(h);
export default function NodeAuthService({ children, state, dispatch }) {
  const { login, signup, changePassword, requestPassChange } = state;

  useEffect(() => {
    if (login) {
      actions.login({ dispatch, state });
    }
  }, [login]);

  useEffect(() => {
    if (signup) {
      actions.signup({ dispatch, state });
    }
  }, [signup]);

  useEffect(() => {
    if (changePassword) {
      actions.changePassword({ dispatch, state });
    }
  }, [changePassword]);

  useEffect(() => {
    if (requestPassChange) {
      actions.forgotPassword({ dispatch, state });
    }
  }, [requestPassChange]);
  return html`${children}`;
}
