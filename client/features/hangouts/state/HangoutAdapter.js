import { h } from "preact";
import { ParseServer } from "../services/parse/ParseServer";
import { WebSocketContainer } from "../services/websocket/WebSocketContainer";

export default function HangoutAdapter(props) {
  if (PREACT_APP_BACK === "PREACT_APP_PARSE") {
    return <ParseServer {...props} />;
  } else if (PREACT_APP_BACK === "PREACT_APP_NODEJS") {
    return <WebSocketContainer {...props} />;
  } else return null;
}
