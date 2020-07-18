import { h, createContext } from "preact";
import { useContext, useMemo, useReducer } from "preact/hooks";
import appReducer, { initState } from "./appReducer";
import { useAppRoute } from "components/app-route";
import actionTypes from "./actionTypes";
const AppContext = createContext();

export function useApplication() {
  const { onAppRoute } = useAppRoute();
  const [state, dispatch] = useContext(AppContext);

  function displayError({ error }) {
    dispatch({ type: actionTypes.APP_ERROR_MESSAGE, error });
    onAppRoute({ route: "/error", featureRoute: "/" });
  }
  return { displayError, state };
}

export default function ApplicationProvider(props) {
  const { children } = props;
  const [state, dispatch] = useReducer(appReducer, initState);
  const value = useMemo(() => [state, dispatch], [state]);
  return (
    <AppContext.Provider value={value} {...props}>
      {children}
    </AppContext.Provider>
  );
}
