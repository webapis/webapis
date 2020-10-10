import { h } from "preact";
import htm from "htm.module";
import WebSocketProvider from "../../features/websocket/WebSocketProvider";
import RtcMockServer from "../../apps/hangout-app/RtcMockServer";
const html = htm.bind(h);
export default function RtcMsgService(props) {
  const { children, staticUser } = props;
  switch (RTC) {
    case "WEBSOCKET":
      return html`<${WebSocketProvider}
        >${({ sendMessage, message, connectionState, setRtcUrl }) => {
          return children({ sendMessage, message, connectionState, setRtcUrl });
        }}<//
      >`;
    case "MOCK":
      return html`<${RtcMockServer} user=${staticUser}
        >${({ sendMessage, message, connectionState, setRtcUrl }) => {
          return children({
            sendMessage,
            message,
            connectionState,
            setRtcUrl,
          });
        }}<//
      >`;
    case "NONE":
      return children({
        sendMessage: null,
        message: null,
        connectionState: null,
        setRtcUrl: null,
      });
    default:
      throw "No RTCService";
  }
}
