import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
//import { ParseServer } from "./parse/ParseServer";
import WebSocketProvider from "../../features/websocket/WebSocketProvider";
import HangoutServer from "../../apps/hangout-app/HangoutServer";
const html = htm.bind(h);
export default function RtcMsgService(props) {
  const { children, url } = props;
  switch (RTC) {
    case "WEBSOCKET":
      debugger;
      return html`<${WebSocketProvider} ...${props}
        >${({ sendMessage, message, connectionState }) => {
          return children({ message, sendMessage, connectionState, url });
        }}<//
      >`;
    case "MOCK":
      debugger;
      return html`<${HangoutServer} ...${props}
        >${({ sendMessage, message, connectionState }) => {
          return children({ message, sendMessage, connectionState, url });
        }}<//
      >`;
  }
}
