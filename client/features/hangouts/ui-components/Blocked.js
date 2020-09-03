import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { Block } from "icons/Block";
import Button from "controls/button/index";
import Layout from "./Layout";

const html = htm.bind(h);

export default function Blocked({ username, onUserClientCommand, onClose }) {
  return html`
    <${Layout} id="blocked-ui" username=${username} desc="You have blocked ">
      <div class="d-flex flex-column  h-100 justify-content-between">
        <div class="d-flex justify-content-center">
          <${Block} width="60" height="70" color="red" />
        </div>

        <div class="btn-group d-flex" role="group">
          <${Button}
            data-testid="close-btn"
            onClick=${onClose}
            title="CLOSE"
            bg="secondary"
            block
            outline
          />

          <${Button}
            id="UNBLOCK"
            onClick=${onUserClientCommand}
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
