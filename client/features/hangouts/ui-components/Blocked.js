import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { Block } from "icons/Block";
import { Center } from "components/layout/Center";
import Button from "controls/button/index";
import Layout from "./Layout";

const style = {
  layout: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
    boxSizing: "border-box",
    paddingTop: 68,
  },
};
const html = htm.bind(h);

export default function Blocked({ hangout, onUnblock, onClose }) {
  return html`
    <${Layout} style=${style.layout} id="blocked-ui">
      <${Center} style=${{ flexDirection: "column", alignItems: "center" }}>
        <${Block} width="60" height="70" color="red" />
        <b>{hangout && hangout.username}</b> is blocked
      <//>
      <div class="row">
        <div class="col">
          <${Button}
            data-testid="close-btn"
            onClick=${onClose}
            title="CLOSE"
            bg="secondary"
            block
            outline
          />
        </div>
        <div class="col">
          <${Button}
            id="UNBLOCK"
            onClick=${onUnblock}
            data-testid="unblock-btn"
            title="UNBLOCK"
            bg="primary"
            block
          />
        </div>
      </div>
    <//>
  `;
}
