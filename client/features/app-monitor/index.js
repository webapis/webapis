import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import MonitorProvider from "./state/MonitorProvider";
import ErrorMonitor from "./ui-components/ErrorMonitor";
const html = htm.bind(h);

export default function AppMonitor() {
  return html`<${MonitorProvider}>
    <${ErrorMonitor} />
  <//>`;
}
