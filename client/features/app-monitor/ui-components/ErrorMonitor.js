import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { useEffect } from "https://cdn.jsdelivr.net/gh/webapis/webapis@cbdf6161bd8ca09a385d62c8c697bd1cd87bb184/hooks.cdn.js";
import { useMonitor } from "../state/MonitorProvider";
const html = htm.bind(h);

export default function ErrorMonitor() {
  const { fetchErrors, state } = useMonitor();
  const { errors } = state;
  useEffect(() => {
    fetchErrors();
  }, []);
  if (errors && errors.length > 0) {
    return errors.map((e) => {
      return html`<div>${e.message}: ${e.stack}</div>`;
    });
  }
  return html` <div>No error logs</div>`;
}
