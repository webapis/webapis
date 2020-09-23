import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
const html = htm.bind(h);
import AuthService from "./auth-adapter/AuthService";
import RtcMsgService from "./rtc-msg-adapter/RtcMsgService";
import AppRouteProvider from "../components/app-route/index";
export default function ServiceAdapter(props) {
  const { children } = props;
  return html`<${AppRouteProvider}>
    <${AuthService}>
      <${RtcMsgService} ...${props}>${children}<//>
    <//>
  <//>`;
}
