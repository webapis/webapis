import { h } from "preact";
import htm from "htm.module";
const html = htm.bind(h);
import AuthService from "./auth-adapter/AuthService";
import RtcMsgService from "./rtc-msg-adapter/RtcMsgService";
import AppRouteProvider from "../components/app-route/index";
import HangoutsService from "../features/hangouts/state/HangoutsService";
import useUnread from "../features/hangouts/state/useUnread";
export default function ServiceAdapter(props) {
  const { children, staticUser } = props;
  return html`<${AppRouteProvider}>
    <${AuthService} staticUser=${staticUser}>
      ${({ user }) => {
        return html` <${RtcMsgService} staticUser=${staticUser}>
          ${({ sendMessage, message, connectionState, setRtcUrl }) => {
            return html`<${HangoutsService}
              sendMessage=${sendMessage}
              message=${message}
              connectionState=${connectionState}
              user=${user}
            >
              ${children({ setRtcUrl, connectionState, user })}
            <//>`;
          }}<//
        >`;
      }}
    <//>
  <//>`;
}
