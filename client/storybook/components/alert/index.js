import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import Alert from "controls/alert/index";

const html = htm.bind(h);
export default function AlertDemo() {
  return html` <${Alert}
    alert="danger"
    message="Server is temporarily unavailable"
  />`;
}
