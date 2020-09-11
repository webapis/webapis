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
import reducer, { initState } from "./reducer";
import { initWebSocket } from "./actions";
const html = htm.bind(h);

export const WebSocketContext = createContext();

export default function WebSocketProvider(props) {
  const { user, url } = props;

  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    if (user) {
      initWebSocket({ url, dispatch });
    }
  }, [user]);

  const value = useMemo(() => [state, dispatch], [state]);

  return html`<${HangoutContext.Provider} value=${value} ...${props} />`;
}
