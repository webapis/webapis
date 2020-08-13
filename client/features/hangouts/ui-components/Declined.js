import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { Done } from "icons/Done";
import { Center } from "components/layout/Center";
import Layout from "./Layout";
const html = htm.bind(h);
const style = {
  layout: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
};
export default function Declined({ hangout, dispatch }) {
  return html`
    <${Layout} style=${style.layout} id="declined-ui">
      <${Center}>
        <${Done} width="70" height="70" color="red" />
      <//>
      <${Center}>
        <p>
          Invitation from
          ${" "}<b>${hangout && hangout.email}</b>${" "}declined.
        </p>
      <//>
    <//>
  `;
}
