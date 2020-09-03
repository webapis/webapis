import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import Layout from "./Layout";
import Button from "controls/button/index";
const html = htm.bind(h);
const style = {
  checkbox: { marginRight: 8 },
  checkboxRoot: {
    display: "flex",
    alignItems: "center",
    padding: 16,
  },
  layout: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
    boxSizing: "border-box",
    paddingTop: 68,
  },
};

export default function Block({
  onCancel,
  onUserClientCommand,
  onReport,
  username = "",
}) {
  return html`
    <${Layout} username=${username} desc="You are about to block ">
      <div class="d-flex flex-column h-100 justify-content-between">
        <div style=${style.checkboxRoot}>
          <input type="checkbox" style=${style.checkbox} onChange=${onReport} />
          <label>Report</label>
        </div>
        <div class="btn-group d-flex" role="group">
          <${Button}
            data-testid="cancel-btn"
            onClick=${onCancel}
            title="Close"
            bg="secondary"
            outline
            block
          />

          <${Button}
            id="BLOCK"
            onClick=${onUserClientCommand}
            data-testid="block-btn"
            title="Block"
            bg="primary"
            block
          />
        </div>
      </div>
    <//>
  `;
}
