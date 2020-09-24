import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import HangoutsAdapter from "../../features/hangouts/state/HangoutsAdapter";
const html = htm.bind(h);

export default function (props) {
  const { children } = props;
  return html`<${HangoutsAdapter} ...${props}>${children}<//>`;
}