import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import Layout from "./Layout";

import Button from "controls/button/index";
const html = htm.bind(h);

export default function Configure({
  onDelete,
  onArchive,
  onNavigation,
  onOk,
  target,
  state,
}) {
  return html`
    <${Layout}
      target=${target}
      desc="Configurations for "
      onNavigation=${onNavigation}
    >
      <div
        data-testid="config-ui"
        class="d-flex flex-column justify-content-between h-100"
      >
        <div>
          <div class="btn-group-vertical p-5 d-flex" role="group">
            <button
              class="btn btn-outline-warning"
              disabled
              onClick=${onArchive}
            >
              Archive
            </button>
            <button
              class="btn btn-outline-warning"
              disabled
              onClick=${onDelete}
            >
              Delete
            </button>
            ${state !== "BLOCKED" &&
            state !== "DECLINED" &&
            html`
              <button
                class="btn btn-outline-warning"
                data-testid="bckui-btn"
                id="bckui"
                title="Block"
                onClick=${onNavigation}
              >
                Block
              </button>
            `}
            ${state === "BLOCKED" &&
            html`
              <button
                class="btn btn-outline-warning"
                data-testid="blocked-ui-btn"
                id="UNBLOCK"
                title="Unblock"
                onClick=${onNavigation}
              >
                Unblock
              </button>
            `}
            ${state === "DECLINED" &&
            html`
              <button
                class="btn btn-outline-warning"
                data-testid="declined-ui-btn"
                id="UNDECLINE"
                title="Undecline"
                onClick=${onNavigation}
              >
                Undecline
              </button>
            `}
          </div>
        </div>
        <div class="p-2">
          <${Button}
            id="HANGCHAT"
            data-testid="config-close-btn"
            onClick=${onNavigation}
            title="Close"
            bg="success"
          />
        </div>
      </div>
    <//>
  `;
}
