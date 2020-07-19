import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import { ParseServer } from "../services/parse/ParseServer";
import { WebSocketContainer } from "../services/websocket/WebSocketContainer";

export default function HangoutAdapter(props) {
  if (PREACT_APP_BACK === "PREACT_APP_PARSE") {
    return <ParseServer {...props} />;
  } else if (PREACT_APP_BACK === "PREACT_APP_NODEJS") {
    return <WebSocketContainer {...props} />;
  } else return null;
}
