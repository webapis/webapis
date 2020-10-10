import { h, createContext } from "preact";
import { useContext, useReducer, useMemo, useEffect } from "preact/hooks";
import htm from "htm.module";
import { reducer, initState } from "./reducer";
import { actionTypes } from "./actionTypes";
const html = htm.bind(h);
const AppRouteContext = createContext();

export function useAppRoute() {
  const context = useContext(AppRouteContext);

  if (!context) {
    throw new Error("useAppRouteContext must be used with AppRouteProvider");
  }
  const [state, dispatch] = context;
  const { name } = state;
  function onAppRoute({ appRoute, featureRoute }) {
    //if (name) {
    //  localStorage.setItem(name, JSON.stringify({ route, featureRoute }));
    // }

    dispatch({ type: actionTypes.APP_ROUTE_CHANGED, featureRoute, appRoute });
  }

  return { onAppRoute, state };
}

export default function AppRouteProvider(props) {
  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    if (state && state.name && localStorage.getItem(state.name)) {
      const { featureRoute, appRoute } = JSON.parse(
        localStorage.getItem(state.name)
      );
      dispatch({ type: actionTypes.APP_ROUTE_CHANGED, featureRoute, appRoute });
    }
  }, []);

  const value = useMemo(() => [state, dispatch], [state]);
  return html`<${AppRouteContext.Provider} value=${value} ...${props} />`;
}
