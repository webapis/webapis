import {
  h,
  createContext,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useContext,
  useReducer,
  useMemo,
  useEffect,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cbdf6161bd8ca09a385d62c8c697bd1cd87bb184/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { reducer } from "./reducer";
import { actionTypes } from "./actionTypes";
const html = htm.bind(h);
const AppRouteContext = createContext();

function useAppRouteContext() {
  const context = useContext(AppRouteContext);

  if (!context) {
    throw new Error("useAppRouteContext must be used with AppRouteProvider");
  }
  return context;
}
export function FeatureRoute(props) {
  const { children, path, paths } = props;

  const [state, dispatch] = useAppRouteContext();
  const { featureRoute } = state;

  if (path && featureRoute === path) {
    return children;
  } else if (paths && featureRoute === paths.find((p) => p === featureRoute)) {
    return children;
  }
  return null;
}
export function useAppRoute() {
  const [state, dispatch] = useAppRouteContext();
  const { name } = state;
  function onAppRoute({ route, featureRoute }) {
    if (name) {
      localStorage.setItem(name, JSON.stringify({ route, featureRoute }));
    }

    dispatch({ type: actionTypes.APP_ROUTE_CHANGED, featureRoute, route });
  }

  return { onAppRoute };
}

export function AppRoute(props) {
  const { children, path, paths } = props;

  const [state, dispatch] = useAppRouteContext();
  const { route } = state;
  if (path && route === path) {
    return children;
  } else if (paths && route === paths.find((p) => p === route)) {
    return children;
  }
  return null;
}
export default function AppRouteProvider(props) {
  const { initState } = props;
  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    if (state && state.name && localStorage.getItem(state.name)) {
      const { featureRoute, route } = JSON.parse(
        localStorage.getItem(state.name)
      );
      dispatch({ type: actionTypes.APP_ROUTE_CHANGED, featureRoute, route });
    }
  }, []);

  const value = useMemo(() => [state, dispatch], [state]);
  return html`<${AppRouteContext.Provider} value=${value} ...${props} />`;
}
