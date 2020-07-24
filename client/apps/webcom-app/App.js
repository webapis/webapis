import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { AppNavigation } from "./AppNavigation";
import { AppRoutes } from "./AppRoutes";
const html = htm.bind(h);
export function App() {
  return html`
    <div>
      <${AppNavigation} />
      <${AppRoutes} />
    </div>
  `;
}
