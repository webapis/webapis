import { h } from "preact";
import htm from "htm.module";
import MonitorProvider from "./state/MonitorProvider";
import ErrorMonitor from "./ui-components/ErrorMonitor";
const html = htm.bind(h);

export default function AppMonitor() {
  return html`<${MonitorProvider}>
    <${ErrorMonitor} socketUrl=${`wss://${ip}:3000`} />
  <//>`;
}
