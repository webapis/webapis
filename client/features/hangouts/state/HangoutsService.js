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
import HangoutsProvider from "./HangoutsProvider";
const html = htm.bind(h);

export default function HangoutsService(props) {
  const { children, user, sendMessage, message, connectionState } = props;
  switch (HANGOUTS) {
    case "INCLUDE":
      return html`<${HangoutsProvider}
        user=${user}
        sendMessage=${sendMessage}
        message=${message}
        connectionState=${connectionState}
        user=${user}
        >${children}<//
      >`;
    case "NONE":
      return children;
    default:
      throw "HangoutsSerivce case missing";
  }
}
