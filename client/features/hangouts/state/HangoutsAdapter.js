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

export default function HangoutsAdapter(props) {
  switch (HANGOUTS) {
    case "INCLUDE":
      return html`<${HangoutsProvider} ...${props} />`;
    case "NONE":
      return html`<div ...${props} />`;
    default:
      throw "HangoutsAdapter case missing";
  }
}
