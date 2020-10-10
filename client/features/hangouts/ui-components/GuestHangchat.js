import { h } from "preact";
import htm from "htm.module";
import Navigation from "./Navigation";
import Hangchat from "./Hangchat";
const html = htm.bind(h);

export default function GuestHangchat() {
  return html`<div>
    <${Navigation} />
    <${Hangchat} />
  </div> `;
}
