import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import Navigation from "./Navigation";
import Hangchat from "./Hangchat";
const html = htm.bind(h);

export default function GuestHangchat() {
  return html`<div>
    <${Navigation} />
    <${Hangchat} />
  </div> `;
}