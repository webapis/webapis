import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { Block } from "icons/Block";
import { Center } from "components/layout/Center";
import Button from "controls/button/index";
import Layout from "./Layout";

const html = htm.bind(h);

export default function Blocked({ hangout, onUserClientCommand, onClose }) {
  return html`
    <${Layout} id="blocked-ui">
      <div class="card-header ">
        <b data-testid="blocked-username">${hangout && hangout.username}</b> is
        blocked
      </div>
      <div class="card-body">
        <${Center} style=${{ flexDirection: "column", alignItems: "center" }}>
          <${Block} width="60" height="70" color="red" />
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
              onClick=${onUserClientCommand}
              data-testid="unblock-btn"
              title="UNBLOCK"
              bg="primary"
              block
            />
          </div>
        </div>
      </div>
    <//>
  `;
}
