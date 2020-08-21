import {
  h,
  createContext,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useReducer,
  useContext,
  useEffect,
  useMemo,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { authReducer, initState } from "./authReducer";
import AuthAdapter from "./AuthAdapter";
import { useAppRoute } from "components/app-route/index";
import { loadBrowserId } from "./onBrowserId";
import actionTypes from "./actionTypes";
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
  const { children, authedRoute } = props;
  const [state, dispatch] = useReducer(authReducer, initState);
  const { onAppRoute } = useAppRoute();
  const { user } = state;
  const value = useMemo(() => [state, dispatch], [state]);
  useEffect(() => {
    if (userExist()) {
      loadUserAndBrowserId({ dispatch });
    }
  }, []);
  useEffect(() => {
    if (user) {
      onAppRoute({
        route: authedRoute.route,
        featureRoute: authedRoute.featureRoute,
      });
    } else {
      onAppRoute({ route: "/auth", featureRoute: "/login" });
    }
  }, [user]);

  return html`
    <${AuthContext.Provider} value=${value} ...${props}>
      <${AuthAdapter} state=${state} dispatch=${dispatch}>
        ${children}
      <//>
    <//>
  `;
}

function userExist() {
  if (window.localStorage.getItem("webcom") === null) {
    return false;
  } else {
    return true;
  }
}

function loadUserAndBrowserId({ dispatch }) {
  const { username, token, email, objectId } = JSON.parse(
    window.localStorage.getItem("webcom")
  );
  dispatch({
    type: actionTypes.RECOVER_LOCAL_AUTH_STATE,
    user: { username, token, email, objectId },
  });
  const browserId = loadBrowserId();
  dispatch({ type: actionTypes.BROWSER_ID_LOADED, browserId });
}
