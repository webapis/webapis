import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { ParseServer } from "../services/parse/ParseServer";
import { WebSocketContainer } from "../services/websocket/WebSocketContainer";
const html = htm.bind(h);
export default function HangoutAdapter(props) {
  if (PREACT_APP_BACK === "PREACT_APP_PARSE") {
    return html`<${ParseServer} ...${props} />`;
  } else if (PREACT_APP_BACK === "PREACT_APP_NODEJS") {
    return html`<${WebSocketContainer} ...${props} />`;
  } else return null;
}
