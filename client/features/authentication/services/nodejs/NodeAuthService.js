import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import { useEffect } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/hooks.module.js";
import * as actions from "./actions";
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
  return children;
}
