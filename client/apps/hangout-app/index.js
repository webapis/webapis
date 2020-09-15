import "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.2.0/fetch.js";
import {
  h,
  render,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import HangoutClient from "./HangoutClient";
const html = htm.bind(h);
const demoAuthState = {
  user: { username: "demouser", browserId: "1234567890" },
};
const beroAuthState = {
  user: { username: "berouser", browserId: "1234567890" },
};
render(
  html`<div class="row">
    <div class="col">
      <${HangoutClient} authState=${demoAuthState} />
    </div>
    <div class="col">
      <${HangoutClient} authState=${beroAuthState} />
    </div>
  </div>`,
  document.body
);
