import { h } from "preact";
import htm from "htm.module";
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
  target = "",
}) {
  return html`
    <${Layout} target=${target} desc="You are about to block ">
      <div
        data-testid="block-ui"
        class="d-flex flex-column h-100 justify-content-between"
      >
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
            bg="success"
            block
          />
        </div>
      </div>
    <//>
  `;
}
