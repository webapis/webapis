import { h } from "preact";
import htm from "htm.module";
import AppNavigation from "./AppNavigation";
import { AppRoutes } from "./AppRoutes";
const html = htm.bind(h);
export function App(props) {
  return html`
    <div class="bg-success">
      <${AppRoutes} ...${props} />
    </div>
  `;
}
//
