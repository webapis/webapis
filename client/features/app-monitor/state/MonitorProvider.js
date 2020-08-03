import {
  h,
  createContext,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useContext,
  useMemo,
  useReducer,
  useEffect,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
const html = htm.bind(h);
import monitorReducer, { initState } from "./monitorReducer";
import actionTypes from "./actionTypes";
const MonitorContext = createContext();

export function useMonitor() {
  const context = useContext(MonitorContext);

  if (!context) {
    throw new Error("useMonitor must be used with MonitorProvider");
  }
  const [state, dispatch] = context;
  const { errors } = state;
  async function fetchErrors() {
    try {
      dispatch({ type: actionTypes.FETCH_ERRORS_STARTED });
      const response = await fetch("/monitor/errors/");

      const result = await response.json();

      dispatch({
        type: actionTypes.FETCH_ERRORS_SUCCESS,
        errors: result.errors,
      });
    } catch (error) {
      dispatch({ type: actionTypes.FETCH_ERRORS_FAILED, error });
    }
  }
  function clietErrorRecieved({ error }) {
    dispatch({ type: actionTypes.UPDATE_ERRORS, error });
  }
  return { fetchErrors, state, clietErrorRecieved };
}

export default function MonitorProvider(props) {
  const { children } = props;
  const [state, dispatch] = useReducer(monitorReducer, initState);

  const value = useMemo(() => [state, dispatch], [state]);

  return html`<${MonitorContext.Provider} value=${value} ...${props}
    >${children}
  <//>`;
}
