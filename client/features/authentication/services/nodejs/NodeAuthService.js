import { h } from "preact";
import { useEffect } from "preact/hooks";
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
