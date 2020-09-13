import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
//import { ParseServer } from "./parse/ParseServer";
import WebSocketProvider from "../../features/websocket/WebSocketProvider";
const html = htm.bind(h);
export default function RtcMsgService(props) {
  const { children } = props;
  return html`<${WebSocketProvider} ...${props}
    >${({ sendMessage, message, connectionState }) => {
      return children({ message, sendMessage, connectionState });
    }}<//
  >`;
}
