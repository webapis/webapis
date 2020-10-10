import { h } from "preact";
import htm from "htm.module";
import { Block } from "icons/Block";
import Button from "controls/button/index";
import Layout from "./Layout";

const html = htm.bind(h);

export default function Blocked({
  target,
  onUserClientCommand,
  onClose,
  state,
}) {
  return html`
    <${Layout} id="blocked-ui" target=${target} desc="You have blocked ">
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
          ${state === "BLOCKED" &&
          html`
            <${Button}
              id="UNBLOCK"
              onClick=${onUserClientCommand}
              data-testid="unblock-btn"
              title="UNBLOCK"
              bg="success"
              block
            />
          `}
          ${state === "DECLINED" &&
          html`
            <${Button}
              id="UNDECLINE"
              onClick=${onUserClientCommand}
              data-testid="undecline-btn"
              title="UNDECLINE"
              bg="success"
              block
            />
          `}
        </div>
      </div>
    <//>
  `;
}
