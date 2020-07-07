import { h } from "preact";
import { useEffect } from "preact/hooks";
import * as actions from "./actions";
export default function ParseAuthService({ children, state, dispatch }) {
  const { login, signup, changePassword, requestPassChange } = state;

  useEffect(() => {
    if (login) {
      actions.login({ dispatch, state });
    }
  }, [login]);

  useEffect(() => {
    if (signup) {
      debugger;
      actions.signup({ dispatch, state });
    }
  }, [signup]);

  useEffect(() => {
    if (requestPassChange) {
      actions.forgotPassword({ dispatch, state });
    }
  }, [requestPassChange]);
  return children;
}
