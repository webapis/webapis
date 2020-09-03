import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import Layout from "./Layout";

import Button from "controls/button/index";
const html = htm.bind(h);

export default function Configure({
  onBlock,
  onDelete,
  onArchive,
  onNotification,
  onConversationHistory,
  onNavigation,
  onOk,
  username,
}) {
  return html`
    <${Layout}
      username=${username}
      desc="Configurations for "
      onNavigation=${onNavigation}
    >
      <div class="d-flex flex-column justify-content-between h-100">
        <div>
          <div class="btn-group-vertical p-5 d-flex" role="group">
            <${IconButton} title="Archive" onClick=${onArchive}>
              <${ArchiveIcon} /> Archive
            <//>
            <${IconButton} title="Delete" onClick=${onDelete}>
              <${TrashIcon} />Delete
            <//>
            <${IconButton} id="bckui" title="Block" onClick=${onNavigation}>
              <${BlockIcon} onClick=${onNavigation} />Block
            <//>
          </div>
        </div>
        <div class="p-2">
          <${Button} onClick=${onOk} title="Close" bg="primary" />
        </div>
      </div>
    <//>
  `;
}

function IconButton(props) {
  const { children } = props;
  return html`
    <button class="btn btn-outline-secondary" ...${props}>
      ${children}
    </button>
  `;
}

function ArchiveIcon() {
  return html`
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      class="bi bi-archive-fill"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15h9.286zM5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8H.8z"
      />
    </svg>
  `;
}

function TrashIcon() {
  return html`
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      class="bi bi-trash-fill"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"
      />
    </svg>
  `;
}

function BlockIcon({ onClick }) {
  return html`
    <svg
      onClick=${onClick}
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      class="bi bi-x-square-fill"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        onClick=${onClick}
        id="bckui-btn"
        fill-rule="evenodd"
        d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"
      />
    </svg>
  `;
}
