import { h, createContext } from "preact";
import { useContext, useMemo, useReducer, useEffect } from "preact/hooks";
import htm from "htm.module";
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
