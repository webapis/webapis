import {
  h,
  createContext,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useReducer,
  useContext,
  useState,
  useMemo,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cbdf6161bd8ca09a385d62c8c697bd1cd87bb184/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { authReducer, initState } from "./authReducer";
import AuthAdapter from "./AuthAdapter";
const AuthContext = createContext();
const html = htm.bind(h);
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used with AppProvider");
  }

  const [state, dispatch] = context;

  return {
    state,
    dispatch,
  };
}

export default function AuthProvider(props) {
  const { children } = props;
  const [state, dispatch] = useReducer(authReducer, initState);
  const value = useMemo(() => [state, dispatch], [state]);
  return html`
    <${AuthContext.Provider} value=${value} ...${props}>
      <${AuthAdapter} state=${state} dispatch=${dispatch}>
        ${children}
      <//>
    <//>
  `;
}
