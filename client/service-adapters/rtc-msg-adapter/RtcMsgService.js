import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import WebSocketProvider from "../../features/websocket/WebSocketProvider";
import RtcMockServer from "../../apps/hangout-app/RtcMockServer";
import RtcMsgConsumers from "./RtcMsgConsumers";
const html = htm.bind(h);
export default function RtcMsgService(props) {
  const { children } = props;
  switch (RTC) {
    case "WEBSOCKET":
      return html`<${WebSocketProvider} ...${props}
        >${({ sendMessage, message, connectionState, setRtcUrl }) => {
          return html`<${RtcMsgConsumers}
            connectionState=${connectionState}
            message=${message}
            sendMessage=${sendMessage}
            ...${props}
            >${() => {
              return children({ setRtcUrl, connectionState });
            }}
          <//> `;
        }}<//
      >`;
    case "MOCK":
      return html`<${RtcMockServer} ...${props}
        >${({ sendMessage, message, connectionState, setRtcUrl }) => {
          return html`<${RtcMsgConsumers}
              connectionState=${connectionState}
              message=${message}
              sendMessage=${sendMessage}
              setRtcUrl=${setRtcUrl}
              ...${props}
              >${({ setRtcUrl }) => {
                return children({ setRtcUrl, connectionState });
              }}
            <//>
            >`;
        }}<//
      >`;
    case "NONE":
      return children({ setRtcUrl: null });
    default:
      throw "No RTCService";
  }
}
