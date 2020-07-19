import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { AppRoute } from "components/app-route/index";
import { OnlineStatus } from "icons/onlineStatus/onlineStatus";
import AuthDemoRoutes from "./authentication/route";
import ComponentsRoutes from "./components/route";
import HangoutRoutes from "./hangout/route";
import BootstrapIcons from "./icons/index";
const html = htm.bind(h);

export default function StorybookRoutes() {
  return html`
    <div style=${{ height: "85vh" }}>
      <${AppRoute} path="/online">
        <div>
          <${OnlineStatus} online />
          <${OnlineStatus} />
        </div>
      <//>

      <${AppRoute} path="/icons">
        <${BootstrapIcons} />
      <//>
      <${AuthDemoRoutes} />
      <${ComponentsRoutes} />
      <${HangoutRoutes} />
    </div>
  `;
}
