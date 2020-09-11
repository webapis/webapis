import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { AppRoute } from "../client/components/app-route/index";
import AuthDemoRoutes from "./authentication/route";
import ComponentsRoutes from "./components/route";
import HangoutRoutes from "./hangout/route";
import WebrtcRoutes from "./webrtc/route";
import WebSocketRoutes from "./websocket/route";
import BootstrapIcons from "./icons/index";
const html = htm.bind(h);

export default function StorybookRoutes() {
  return html`
    <div style=${{ height: "85vh" }}>
      <${AppRoute} path="/icons">
        <${BootstrapIcons} />
      <//>
      <${AuthDemoRoutes} />
      <${ComponentsRoutes} />
      <${HangoutRoutes} />
      <${WebrtcRoutes} />
      <${WebSocketRoutes} />
    </div>
  `;
}
