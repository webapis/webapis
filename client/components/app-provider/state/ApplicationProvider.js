import {
  h,
  createContext,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useContext,
  useMemo,
  useReducer,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cbdf6161bd8ca09a385d62c8c697bd1cd87bb184/hooks.cdn.js";
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
